import { writeFile } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'
import { evaluate } from './chrome.mjs'
const check = (result, name, passed, details) => result.checks.push({ name, passed: Boolean(passed), details })
const key = async (send, value, code, number) => {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code, windowsVirtualKeyCode: number, text: value === 'Enter' ? '\r' : value === ' ' ? ' ' : undefined })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code, windowsVirtualKeyCode: number })
}
async function ready(send) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(send, `document.readyState === 'complete' && !!document.querySelector('#hero-title')`)) {
      await evaluate(send, 'document.fonts.ready')
      await sleep(180)
      return
    }
    await sleep(100)
  }
  throw new Error('Timed out waiting for portfolio')
}
async function screenshot(send, filename) {
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(`.qa/${filename}.png`, Buffer.from(shot.data, 'base64'))
}
const visible = `(element) => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && Number(style.opacity) > 0;
}`

export async function inspectEnhanced(send, result, baseUrl) {
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  for (const [width, height] of [[320,740],[390,844],[430,932],[768,1024],[1024,900],[1280,832],[1440,1000],[1920,1080],[320,568],[1440,600],[390,1100],[1920,1200]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 })
    await send('Page.navigate', { url: baseUrl })
    await ready(send)
    const geometry = await evaluate(send, `(() => {
      const hero = document.querySelector('.hero'), stage = document.querySelector('.hero-stage');
      const visible = ${visible};
      return { range: hero.offsetHeight - stage.offsetHeight, stageHeight: stage.offsetHeight,
        enabled: hero.dataset.motion === 'enabled', visible: [...document.querySelectorAll('.hero-name,.hero-portrait')].every(visible),
        ctaBottom: document.querySelector('.hero-links').getBoundingClientRect().bottom,
        image: document.querySelector('.hero-portrait img').currentSrc,
        overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    })()`)
    check(result, `${width}×${height}: visible hero and responsive portrait`, geometry.visible && !geometry.overflow && geometry.image.endsWith('.webp'), geometry)
    check(result, `${width}×${height}: short viewports use static layout`, geometry.enabled === (height >= 700 && width > 640))
    if (geometry.enabled) {
      check(result, `${width}×${height}: sticky stage and final CTA position fit the viewport`, geometry.stageHeight <= height + 1 && geometry.ctaBottom <= height, geometry)
      const samples = []
      for (const progress of [0,0.25,0.5,0.75,1]) {
        await evaluate(send, `scrollTo({ top: ${geometry.range * progress}, behavior: 'instant' })`)
        await sleep(160)
        const state = await evaluate(send, `(() => {
          const hero = document.querySelector('.hero'), stage = document.querySelector('.hero-stage');
          const opacity = selector => Number(getComputedStyle(document.querySelector(selector)).opacity);
          const title = document.querySelector('.hero-title-word');
          return { stages: {
            ai: opacity('.hero-title-word'), engineer: opacity('.hero-title-line + .hero-title-line .hero-title-word'),
            introduction: opacity('.hero-intro-mask > p'), cta: opacity('.hero-links'), support: opacity('.hero-bottom p'),
            mask: getComputedStyle(title.parentElement).overflow, titleOffset: new DOMMatrix(getComputedStyle(title).transform).m42,
            variables: ['--portrait-stage','--title-stage','--intro-stage','--cta-stage','--exit-stage'].every(key => hero.style.getPropertyValue(key) !== ''),
          }, progress: Number(hero.style.getPropertyValue('--hero-progress')), stageTop: stage.getBoundingClientRect().top, portrait: getComputedStyle(document.querySelector('.hero-portrait')).transform, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
        })()`)
        samples.push(state)
        check(result, `${width}×${height}: progress ${progress}`, Math.abs(state.progress - progress) < 0.015 && Math.abs(state.stageTop) <= 1 && !state.overflow, state)
        const phase = state.stages;
        let staged = phase.variables && phase.mask === 'hidden';
        if (progress === 0) staged &&= phase.ai === 0 && phase.engineer === 0 && phase.introduction === 0 && phase.cta === 0 && phase.support === 0 && phase.titleOffset > 80;
        if (progress === 0.25) staged &&= phase.ai > .99 && phase.engineer > .3 && phase.engineer < .6 && phase.introduction === 0 && phase.cta === 0;
        if (progress === 0.5) staged &&= phase.ai === 1 && phase.engineer === 1 && phase.introduction > .5 && phase.introduction < .7 && phase.cta < .01;
        if (progress >= 0.75) staged &&= phase.ai === 1 && phase.engineer === 1 && phase.introduction === 1 && phase.cta > .995 && phase.support > .995;
        check(result, `${width}×${height}: visibly staged reveal at ${progress}`, staged, phase);
        if (width === 1440 || width === 1280) await screenshot(send, `hero-${width}x${height}-stage-${String(progress * 100).padStart(3,'0')}`);
      }
      check(result, `${width}×${height}: portrait changes through the sequence`, samples[0].portrait !== samples.at(-1).portrait)
      await evaluate(send, `document.querySelector('.hero-links a').focus({preventScroll:true})`)
      check(result, `${width}×${height}: focused sticky CTA remains visible`, await evaluate(send, `(() => { const r = document.activeElement.getBoundingClientRect(); return r.top > 72 && r.bottom < innerHeight && getComputedStyle(document.activeElement).outlineStyle !== 'none'; })()`))
    }
    if (!geometry.enabled) {
      check(result, `${width}×${height}: mobile/short-screen composition is complete immediately`, await evaluate(send, `[...document.querySelectorAll('.hero-title-word,.hero-intro-mask > p,.hero-links,.hero-bottom p')].every(el => getComputedStyle(el).opacity === '1')`));
      if (width === 390) await screenshot(send, `hero-${width}x${height}-static`);
    }
    // Continue native document scrolling beyond the stage, without using an anchor.
    await evaluate(send, `scrollTo({top: document.querySelector('.hero').offsetHeight, behavior:'instant'})`)
    await sleep(160)
    check(result, `${width}×${height}: normal scrolling reaches About`, await evaluate(send, `document.querySelector('#about-title').getBoundingClientRect().top < innerHeight`))
    if (width === 1440 && height === 1000) await screenshot(send, 'hero-1440x1000-about');
    await evaluate(send, `document.querySelector('#about').scrollIntoView({behavior:'instant'})`)
    await sleep(200)
    check(result, `${width}×${height}: About transition and active navigation`, await evaluate(send, `(() => { const r = document.querySelector('#about-title').getBoundingClientRect(); return r.top >= 72 && r.top < innerHeight && document.querySelector('.nav-desktop [aria-current]')?.hash === '#about'; })()`))
    const frozen = await evaluate(send, `document.querySelector('.hero').getAttribute('style')`)
    await sleep(100)
    check(result, `${width}×${height}: offscreen hero stops changing`, frozen === await evaluate(send, `document.querySelector('.hero').getAttribute('style')`))
  }

  // Every native disclosure is activated with both Enter and Space.
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 832, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: baseUrl }); await ready(send)
  await evaluate(send, `document.querySelector('.hero-links a').focus({preventScroll:true})`)
  check(result, 'Keyboard focus reveals hidden desktop actions and title immediately', await evaluate(send, `getComputedStyle(document.querySelector('.hero-links')).opacity === '1' && getComputedStyle(document.querySelector('.hero-title-word')).opacity === '1'`))
  await evaluate(send, `document.activeElement.blur()`)
  const count = await evaluate(send, `document.querySelectorAll('main details').length`)
  for (let i = 0; i < count; i++) {
    await evaluate(send, `document.querySelectorAll('main details')[${i}].querySelector('summary').focus()`)
    await key(send, 'Enter', 'Enter', 13)
    check(result, `Disclosure ${i+1}: Enter opens`, await evaluate(send, `document.querySelectorAll('main details')[${i}].open`))
    await key(send, ' ', 'Space', 32)
    check(result, `Disclosure ${i+1}: Space closes`, await evaluate(send, `!document.querySelectorAll('main details')[${i}].open`))
  }
  const links = await evaluate(send, `Array.from(document.querySelectorAll('a[href]:not([href^="#"])'), a => ({ href: a.getAttribute('href'), target: a.target, rel: a.rel, name: a.getAttribute('aria-label') || a.textContent }))`)
  check(result, 'All outbound destinations are supplied HTTPS/mailto links with accessible new-tab descriptions', links.every(link => /^(https:\/\/github.com\/Dwaraknath1810|mailto:dwaraknath.balaji@gmail.com)$/.test(link.href) && (link.target !== '_blank' || (link.rel.includes('noopener') && link.rel.includes('noreferrer') && /new tab/.test(link.name)))), links)

  // Pointer interpolation stays bounded, settles, and resets without a permanent loop.
  await evaluate(send, `scrollTo({top:0,behavior:'instant'})`); await sleep(200)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1100, y: 250 })
  await sleep(1000)
  const pointer = await evaluate(send, `({ x: Number(document.querySelector('.hero').style.getPropertyValue('--pointer-x')), y: Number(document.querySelector('.hero').style.getPropertyValue('--pointer-y')) })`)
  check(result, 'Desktop pointer movement is bounded and enabled', Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1 && pointer.x !== 0, pointer)
  await evaluate(send, `document.querySelector('.hero-stage').dispatchEvent(new PointerEvent('pointerleave'))`)
  await sleep(1100)
  check(result, 'Pointer leave settles back to neutral', await evaluate(send, `Math.abs(Number(document.querySelector('.hero').style.getPropertyValue('--pointer-x'))) < .003`))
  await evaluate(send, `Object.defineProperty(document, 'hidden', { configurable:true, value:true }); document.dispatchEvent(new Event('visibilitychange')); scrollTo({top:180,behavior:'instant'})`)
  const hiddenStyle = await evaluate(send, `document.querySelector('.hero').getAttribute('style')`)
  await sleep(100)
  check(result, 'Hidden-tab event pauses hero updates', hiddenStyle === await evaluate(send, `document.querySelector('.hero').getAttribute('style')`))
  await evaluate(send, `delete document.hidden; document.dispatchEvent(new Event('visibilitychange'))`)
  await sleep(100)
  check(result, 'Visible-tab event resumes at the actual scroll position', hiddenStyle !== await evaluate(send, `document.querySelector('.hero').getAttribute('style')`))

  for (const scenario of ['reduced-motion','no-observer','no-javascript']) {
    let injected
    if (scenario === 'reduced-motion') await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    if (scenario === 'no-observer') injected = await send('Page.addScriptToEvaluateOnNewDocument', { source: 'delete window.IntersectionObserver; delete window.ResizeObserver;' })
    if (scenario === 'no-javascript') await send('Emulation.setScriptExecutionDisabled', { value: true })
    await send('Page.navigate', { url: baseUrl }); await ready(send)
    const fallback = await evaluate(send, `(() => {
      const visible = ${visible};
      return { static: !document.querySelector('.hero').dataset.motion && getComputedStyle(document.querySelector('.hero-stage')).position !== 'sticky', visible: [...document.querySelectorAll('.hero-title-word,.hero-name,.hero-intro-mask > p,.hero-links,.hero-portrait')].every(visible), sections: document.querySelectorAll('main > section').length, loaded: document.querySelector('.hero-portrait img').naturalWidth > 0 };
    })()`)
    check(result, `${scenario}: complete static portfolio`, fallback.static && fallback.visible && fallback.sections === 8 && fallback.loaded, fallback)
    await screenshot(send, scenario)
    if (scenario === 'no-javascript') {
      await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
      await evaluate(send, `document.querySelector('.fallback-navigation summary').focus()`)
      await key(send, 'Enter', 'Enter', 13)
      check(result, 'No-JS mobile navigation works natively', await evaluate(send, `document.querySelector('.fallback-navigation').open && document.querySelector('.fallback-navigation a').getBoundingClientRect().height >= 44`))
      await send('Emulation.setScriptExecutionDisabled', { value: false })
    }
    if (injected) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: injected.identifier })
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  }
  // 1440×1000 at 200% browser zoom has a 720×500 CSS viewport and DPR 2.
  await send('Emulation.setDeviceMetricsOverride', { width: 720, height: 500, deviceScaleFactor: 2, mobile: false })
  await send('Page.navigate', { url: baseUrl }); await ready(send)
  check(result, '200% zoom-equivalent reflow: no overflow, static hero, all content', await evaluate(send, `document.documentElement.scrollWidth <= innerWidth + 1 && !document.querySelector('.hero').dataset.motion && document.querySelectorAll('main > section').length === 8`))
  await screenshot(send, 'zoom-200-equivalent')
  for (const [width, dpr, expected] of [[390,1,'small'],[390,2,'medium'],[1440,1,'medium'],[1440,2,'portrait-']]) {
    await send('Network.setCacheDisabled', { cacheDisabled: true })
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: dpr, mobile: width < 768 })
    await send('Page.navigate', { url: baseUrl }); await ready(send)
    const images = await evaluate(send, `({ src: document.querySelector('.hero-portrait img').currentSrc, requests: performance.getEntriesByType('resource').filter(r => /portrait.*\\.(webp|jpg)/.test(r.name)).map(r => r.name) })`)
    check(result, `${width}px DPR ${dpr}: one correct responsive image, no JPEG double-download`, images.src.includes(expected) && images.src.endsWith('.webp') && images.requests.length === 1 && !images.requests.some(url => url.endsWith('.jpg')), images)
  }
  console.log(`Extended motion, fallback, keyboard, images, and zoom: ${result.checks.every(c => c.passed) ? 'PASS' : 'FAIL'} (${result.checks.length} checks)`)
}
