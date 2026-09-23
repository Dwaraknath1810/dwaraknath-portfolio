import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

// Local Chrome only. Uses the WebSocket implementation included in modern Node.
// Run after starting Vite: node scripts/browser-check.mjs
const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173'
const chromeBinary = process.env.CHROME_BIN || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome')
const outputDirectory = path.resolve(process.env.QA_OUTPUT || '.qa')
const viewports = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 1000 },
  { width: 1280, height: 832 },
  { width: 1024, height: 900 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
  { width: 320, height: 568 },
  { width: 390, height: 1000 },
  { width: 599, height: 900 },
  { width: 600, height: 900 },
  { width: 640, height: 900 },
  { width: 641, height: 900 },
  { width: 767, height: 900 },
  { width: 1023, height: 900 },
  { width: 1440, height: 600 },
  { width: 1920, height: 1200 },
]

import { ChromeProtocol, debuggingUrl, evaluate } from './chrome-protocol.mjs'

async function waitForApp(send) {
  const deadline = Date.now() + 20_000
  while (Date.now() < deadline) {
    if (await evaluate(send, `document.readyState === 'complete' && Boolean(document.querySelector('#hero-title'))`)) {
      await evaluate(send, `document.fonts.ready.then(() => true)`)
      await sleep(1250)
      return
    }
    await sleep(100)
  }
  throw new Error(`The portfolio did not become ready at ${baseUrl}`)
}

function addCheck(result, name, passed, details) {
  result.checks.push({ name, passed: Boolean(passed), ...(details === undefined ? {} : { details }) })
}

const layoutInspection = `(() => {
  const width = window.innerWidth;
  const bounds = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height };
  };
  const overflows = [];
  for (const element of document.body.querySelectorAll('*')) {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    if (style.display === 'none' || style.visibility === 'hidden' || box.width < 1 || box.height < 1) continue;
    let left = box.left;
    let right = box.right;
    for (let ancestor = element.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
      if (/(hidden|clip|scroll|auto)/.test(getComputedStyle(ancestor).overflowX)) {
        const clip = ancestor.getBoundingClientRect();
        left = Math.max(left, clip.left);
        right = Math.min(right, clip.right);
      }
    }
    if (right > left && (left < -1 || right > width + 1)) {
      overflows.push({ element: element.tagName.toLowerCase(), id: element.id, className: element.getAttribute('class'), left, right });
    }
  }
  const internalLinks = [...document.querySelectorAll('a[href^="#"]')];
  const missingTargets = internalLinks.map(link => link.getAttribute('href')).filter(href => href.length < 2 || !document.getElementById(decodeURIComponent(href.slice(1))));
  const missingLabels = [...document.querySelectorAll('[aria-labelledby]')].flatMap(element => element.getAttribute('aria-labelledby').split(/\\s+/).filter(id => !document.getElementById(id)));
  const unnamedButtons = [...document.querySelectorAll('button')].filter(button => !(button.getAttribute('aria-label') || button.textContent.trim() || button.getAttribute('aria-labelledby'))).length;
  const portrait = document.querySelector('.hero-portrait img');
  return {
    viewport: { width, height: window.innerHeight },
    scrollWidth: document.documentElement.scrollWidth,
    overflows,
    h1Count: document.querySelectorAll('h1').length,
    mainCount: document.querySelectorAll('main').length,
    language: document.documentElement.lang,
    internalLinks: internalLinks.length,
    missingTargets,
    missingLabels,
    unnamedButtons,
    portrait: { loaded: Boolean(portrait && portrait.complete && portrait.naturalWidth > 0), naturalWidth: portrait?.naturalWidth ?? 0, alt: portrait?.getAttribute('alt') ?? '' },
    expertiseCount: document.querySelectorAll('#expertise .expertise-row').length,
    projectCount: document.querySelectorAll('.projects-list > article').length,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    geometry: { title: bounds('#hero-title'), engineer: bounds('#hero-title > span:last-child'), portrait: bounds('.hero-portrait'), name: bounds('.hero-name'), introduction: bounds('.hero-intro') }
  };
})()`

async function inspectInteractions(send, result) {
  for (const selector of ['.expertise-row', '.project-details']) {
    const state = await evaluate(send, `(() => {
      const details = document.querySelector(${JSON.stringify(selector)});
      const summary = details?.querySelector('summary');
      if (!details || !summary) return { found: false };
      const initial = details.open;
      summary.click();
      const toggled = details.open !== initial;
      summary.click();
      return { found: true, toggled, restored: details.open === initial };
    })()`)
    addCheck(result, `${selector} native disclosure opens and closes`, state.found && state.toggled && state.restored, state)
  }

  const contacts = await evaluate(send, `(() => {
    const links = [...document.querySelectorAll('.contact-links a')];
    return links.map(link => ({
      label: link.querySelector('span')?.firstChild?.textContent.trim(),
      display: link.querySelector('small')?.textContent.trim(),
      href: link.getAttribute('href'),
      target: link.getAttribute('target'),
      rel: link.getAttribute('rel')
    }));
  })()`)
  addCheck(result, 'Email and GitHub are the only contact methods',
    contacts.length === 2 && contacts[0].label === 'Email' && contacts[1].label === 'GitHub', contacts)
  addCheck(result, 'Email displays its complete mailto address',
    contacts[0]?.href === `mailto:${contacts[0]?.display}` && contacts[0]?.display.includes('@'))
  addCheck(result, 'GitHub display, HTTPS destination, and external-link protections agree',
    contacts[1]?.href === `https://${contacts[1]?.display}` && contacts[1]?.href.startsWith('https://github.com/')
    && contacts[1]?.target === '_blank' && contacts[1]?.rel?.split(' ').includes('noopener')
    && contacts[1]?.rel?.split(' ').includes('noreferrer'))

  await evaluate(send, `document.querySelector('#work').scrollIntoView({ behavior: 'instant' })`)
  await sleep(120)
  const sectionFeedback = await evaluate(send, `({
    active: document.querySelector('.nav-desktop [aria-current="location"]')?.getAttribute('href'),
    scrolled: document.querySelector('.site-header').dataset.scrolled
  })`)
  addCheck(result, 'Header tracks the current section and scroll state',
    sectionFeedback.active === '#work' && sectionFeedback.scrolled === 'true', sectionFeedback)

  const menuVisible = await evaluate(send, `getComputedStyle(document.querySelector('.nav-toggle')).display !== 'none'`)
  addCheck(result, 'Responsive navigation breakpoint', menuVisible === (result.width < 1024))

  if (!menuVisible) {
    const desktopLinks = await evaluate(send, `document.querySelectorAll('.nav-desktop a').length`)
    addCheck(result, 'Desktop navigation has six links', desktopLinks === 6, desktopLinks)
    return
  }

  await evaluate(send, `(() => { const button = document.querySelector('.nav-toggle'); button.focus(); button.click(); })()`)
  const openState = await evaluate(send, `(() => {
    const button = document.querySelector('.nav-toggle');
    return { expanded: button.getAttribute('aria-expanded'), controls: button.getAttribute('aria-controls'), links: document.querySelectorAll('#mobile-navigation a').length, name: button.getAttribute('aria-label') };
  })()`)
  addCheck(result, 'Mobile menu opens with six links and accessible state', openState.expanded === 'true' && openState.controls === 'mobile-navigation' && openState.links === 6 && Boolean(openState.name), openState)

  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 })
  const escapeState = await evaluate(send, `(() => {
    const button = document.querySelector('.nav-toggle');
    return { closed: !document.querySelector('#mobile-navigation'), expanded: button.getAttribute('aria-expanded'), focusReturned: document.activeElement === button };
  })()`)
  addCheck(result, 'Escape closes mobile menu and restores toggle focus', escapeState.closed && escapeState.expanded === 'false' && escapeState.focusReturned, escapeState)

  await evaluate(send, `document.querySelector('.nav-toggle').click()`)
  await evaluate(send, `document.querySelector('#mobile-navigation a[href="#expertise"]').click()`)
  const anchorState = await evaluate(send, `({ closed: !document.querySelector('#mobile-navigation'), hash: location.hash, expanded: document.querySelector('.nav-toggle').getAttribute('aria-expanded') })`)
  addCheck(result, 'Mobile anchor navigates and closes menu', anchorState.closed && anchorState.hash === '#expertise' && anchorState.expanded === 'false', anchorState)
}

async function capture(send, viewport) {
  // Visit every section so scroll-triggered content is present in the full-page image.
  await evaluate(send, `(async () => {
    for (const section of document.querySelectorAll('main > section')) {
      section.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 90));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.activeElement?.blur();
    await new Promise(resolve => setTimeout(resolve, 150));
  })()`)
  const hero = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false }, 30_000)
  await writeFile(path.join(outputDirectory, `${viewport.width}x${viewport.height}-hero.png`), Buffer.from(hero.data, 'base64'))
  const metrics = await send('Page.getLayoutMetrics')
  const size = metrics.cssContentSize || metrics.contentSize
  const full = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 },
  }, 30_000)
  await writeFile(path.join(outputDirectory, `${viewport.width}x${viewport.height}-full.png`), Buffer.from(full.data, 'base64'))
  return { hero: path.join(outputDirectory, `${viewport.width}x${viewport.height}-hero.png`), fullPage: path.join(outputDirectory, `${viewport.width}x${viewport.height}-full.png`) }
}

const report = {
  startedAt: new Date().toISOString(),
  url: baseUrl,
  scope: 'Local Chrome responsive layout, interactions, and basic semantic checks. This is not a comprehensive accessibility audit.',
  viewports: [],
  consoleErrors: [],
  runtimeExceptions: [],
  networkFailures: [],
  standardMotion: { checks: [] },
  passed: false,
}
let chrome
let protocol
let currentViewport = null
const requestUrls = new Map()

try {
  if (typeof WebSocket === 'undefined') throw new Error('This script requires a Node version with built-in WebSocket support (Node 22 or newer).')
  await mkdir(outputDirectory, { recursive: true })
  chrome = spawn(chromeBinary, [
    '--headless=new',
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    '--remote-debugging-port=0',
    `--user-data-dir=${path.join(outputDirectory, 'chrome-profile')}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })

  const endpoint = await debuggingUrl(chrome)
  // Drain subsequent browser diagnostics without allowing a full stderr pipe to block Chrome.
  chrome.stderr.resume()
  protocol = await ChromeProtocol.connect(endpoint, ({ method, params = {}, sessionId }) => {
    const context = { viewport: currentViewport, sessionId }
    if (method === 'Runtime.consoleAPICalled' && params.type === 'error') {
      report.consoleErrors.push({ ...context, source: 'console', message: params.args.map(arg => arg.value ?? arg.description ?? arg.type).join(' ') })
    }
    if (method === 'Log.entryAdded' && params.entry.level === 'error') {
      report.consoleErrors.push({ ...context, source: params.entry.source, message: params.entry.text, url: params.entry.url })
    }
    if (method === 'Runtime.exceptionThrown') {
      report.runtimeExceptions.push({ ...context, message: params.exceptionDetails.exception?.description || params.exceptionDetails.text })
    }
    if (method === 'Network.requestWillBeSent') requestUrls.set(params.requestId, params.request.url)
    if (method === 'Network.loadingFailed') {
      report.networkFailures.push({ ...context, url: requestUrls.get(params.requestId), error: params.errorText, canceled: Boolean(params.canceled), type: params.type })
    }
  })

  report.browser = await protocol.request('Browser.getVersion')
  const { targetId } = await protocol.request('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await protocol.request('Target.attachToTarget', { targetId, flatten: true })
  const send = protocol.session(sessionId)
  await Promise.all(['Page.enable', 'Runtime.enable', 'Network.enable', 'Log.enable'].map(method => send(method)))
  await send('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })

  for (const viewport of viewports) {
    currentViewport = viewport.width
    const result = { ...viewport, checks: [] }
    report.viewports.push(result)
    await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: viewport.width < 768 })
    const navigation = await send('Page.navigate', { url: baseUrl })
    if (navigation.errorText) throw new Error(`Navigation failed: ${navigation.errorText}`)
    await waitForApp(send)
    const layout = await evaluate(send, layoutInspection)
    result.layout = layout
    addCheck(result, 'Viewport dimensions match requested size', layout.viewport.width === viewport.width && layout.viewport.height === viewport.height, layout.viewport)
    addCheck(result, 'Document has no horizontal overflow', layout.scrollWidth <= viewport.width + 1, layout.scrollWidth)
    addCheck(result, 'Visible elements stay within viewport horizontally', layout.overflows.length === 0, layout.overflows)
    addCheck(result, 'Exactly one main landmark and one h1', layout.mainCount === 1 && layout.h1Count === 1)
    addCheck(result, 'Document language is declared', Boolean(layout.language), layout.language)
    addCheck(result, 'Internal links resolve to existing targets', layout.missingTargets.length === 0, layout.missingTargets)
    addCheck(result, 'ARIA heading references resolve', layout.missingLabels.length === 0, layout.missingLabels)
    addCheck(result, 'Buttons have accessible text', layout.unnamedButtons === 0)
    addCheck(result, 'Portrait loads and has alternative text', layout.portrait.loaded && layout.portrait.alt.trim().length > 0, layout.portrait)
    addCheck(result, 'Eight expertise areas and three projects', layout.expertiseCount === 8 && layout.projectCount === 3, { expertise: layout.expertiseCount, projects: layout.projectCount })
    addCheck(result, 'Reduced motion disables smooth scrolling', layout.reducedMotion && layout.scrollBehavior === 'auto')
    await inspectInteractions(send, result)
    result.screenshots = await capture(send, viewport)
    result.passed = result.checks.every(check => check.passed)
    console.log(`${viewport.width}×${viewport.height}: ${result.passed ? 'PASS' : 'FAIL'} (${result.checks.length} checks)`)
  }

  // Check the ordinary animation path as well as deterministic reduced-motion layouts.
  currentViewport = '1280-standard-motion'
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 832, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  const standardUrl = new URL(baseUrl)
  standardUrl.searchParams.set('qa-motion', 'standard')
  const standardNavigation = await send('Page.navigate', { url: standardUrl.href })
  addCheck(report.standardMotion, 'Normal motion is tested in a fresh document', Boolean(standardNavigation.loaderId))
  await waitForApp(send)
  const entrance = await evaluate(send, `({
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    titleOpacity: getComputedStyle(document.querySelector('#hero-title')).opacity,
    titleLinesSettled: [...document.querySelectorAll('.hero-title-word')].every(line => {
      const transform = getComputedStyle(line).transform;
      return transform === 'none' || new DOMMatrix(transform).m42 === 0;
    }),
    portraitOpacity: getComputedStyle(document.querySelector('.hero-portrait')).opacity,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior
  })`)
  addCheck(report.standardMotion, 'Normal-motion hero starts with masked title and visible portrait',
    !entrance.reduced && entrance.titleOpacity === '1' && !entrance.titleLinesSettled
    && entrance.portraitOpacity === '1' && entrance.scrollBehavior === 'smooth', entrance)

  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  const skipFocus = await evaluate(send, `document.activeElement?.classList.contains('skip-link')`)
  addCheck(report.standardMotion, 'First Tab exposes the skip link', skipFocus)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  addCheck(report.standardMotion, 'Skip link moves keyboard focus to main', await evaluate(send, `document.activeElement?.id === 'main-content'`))

  await evaluate(send, `document.querySelector('.expertise-row summary').focus()`)
  const summaryFocused = await evaluate(send, `document.activeElement === document.querySelector('.expertise-row summary')`)
  addCheck(report.standardMotion, 'Expertise summary receives keyboard focus', summaryFocused)
  // Enter has a text event in a real keypress; native summaries use that event.
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  addCheck(report.standardMotion, 'Enter opens expertise disclosure using the keyboard', await evaluate(send, `document.querySelector('.expertise-row').open`))
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, text: ' ', unmodifiedText: ' ' })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  addCheck(report.standardMotion, 'Space closes expertise disclosure using the keyboard', await evaluate(send, `!document.querySelector('.expertise-row').open`))
  await evaluate(send, `document.querySelector('.project-details summary').focus()`)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  addCheck(report.standardMotion, 'Project approach opens through keyboard activation', await evaluate(send, `document.querySelector('.project-details').open`))
  await extendedChecks(send, report.standardMotion)
  report.standardMotion.passed = report.standardMotion.checks.every(check => check.passed)
  console.log(`Standard motion and keyboard: ${report.standardMotion.passed ? 'PASS' : 'FAIL'}`)

  report.passed = report.viewports.every(viewport => viewport.passed)
    && report.standardMotion.passed
    && report.consoleErrors.length === 0
    && report.runtimeExceptions.length === 0
    && report.networkFailures.every(failure => failure.canceled)
} catch (error) {
  report.fatalError = error instanceof Error ? error.stack : String(error)
  console.error(report.fatalError)
} finally {
  protocol?.close()
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    chrome.kill('SIGTERM')
    const exited = await Promise.race([
      new Promise(resolve => chrome.once('exit', () => resolve(true))),
      sleep(3000).then(() => false),
    ])
    if (!exited) chrome.kill('SIGKILL')
  }
  report.finishedAt = new Date().toISOString()
  await mkdir(outputDirectory, { recursive: true })
  await writeFile(path.join(outputDirectory, 'browser-results.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(`Browser QA ${report.passed ? 'passed' : 'failed'}: .qa/browser-results.json`)
  process.exitCode = report.passed ? 0 : 1
}

async function extendedChecks(send, result) {
  const screenshot = async name => {
    const capture = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    await writeFile(path.join(outputDirectory, `${name}.png`), Buffer.from(capture.data, 'base64'))
  }
  const key = async (value, code, keyCode) => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code, windowsVirtualKeyCode: keyCode, ...(value === 'Enter' ? { text: '\r' } : {}) })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code, windowsVirtualKeyCode: keyCode })
  }
  await send('Page.navigate', { url: baseUrl })
  await waitForApp(send)
  await sleep(1000)
  addCheck(result, 'Exactly one decorative WebGL canvas on supported desktop', await evaluate(send, `document.querySelectorAll('.hero-canvas canvas').length === 1 && document.querySelector('.hero-canvas').getAttribute('aria-hidden') === 'true'`))
  for (const progress of [0, .25, .5, .75, 1]) {
    await evaluate(send, `scrollTo({ top: (document.querySelector('#top').offsetHeight - innerHeight) * ${progress}, behavior: 'instant' })`)
    await sleep(450)
    const state = await evaluate(send, `({ progress: Number(document.querySelector('#top').dataset.progress), introduction: Number(getComputedStyle(document.querySelector('.hero-intro')).opacity), cta: Number(getComputedStyle(document.querySelector('.hero-links')).opacity), portrait: document.querySelector('.hero-portrait img').complete })`)
    addCheck(result, `Hero stage ${progress * 100}% is synchronized and photographic`, Math.abs(state.progress - progress) < .003 && state.portrait && (progress !== 0 || (state.introduction === 0 && state.cta === 0)) && (progress !== 1 || (state.introduction === 1 && state.cta === 1)), state)
    await screenshot(`stage-${progress * 100}`)
  }
  await sleep(700)
  addCheck(result, 'Decorative 3D request starts after the portrait is available', await evaluate(send, `(() => {const r=performance.getEntriesByType('resource'); const scene=r.find(e=>/HeroCanvas.*js/.test(e.name)); const photo=r.find(e=>/portrait-/.test(e.name)); return scene && photo && scene.startTime > photo.responseEnd;})()`))
  const frames = await evaluate(send, `document.querySelector('canvas')?.dataset.frames`)
  await sleep(650)
  addCheck(result, 'WebGL stops rendering when settled', frames !== undefined && frames === await evaluate(send, `document.querySelector('canvas')?.dataset.frames`), { frames })
  await evaluate(send, `Object.defineProperty(document,'hidden',{configurable:true,value:true}); document.dispatchEvent(new Event('visibilitychange'))`)
  await sleep(100)
  const hiddenFrames = await evaluate(send, `document.querySelector('canvas')?.dataset.frames`)
  await evaluate(send, `document.querySelector('#top').dispatchEvent(new PointerEvent('pointermove',{clientX:900,clientY:100,pointerType:'mouse'}))`)
  await sleep(350)
  addCheck(result, 'Document-hidden signal prevents additional rendering', hiddenFrames === await evaluate(send, `document.querySelector('canvas')?.dataset.frames`))
  await evaluate(send, `delete document.hidden; document.dispatchEvent(new Event('visibilitychange'))`)
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 600, y: 500, deltaY: 700, deltaX: 0 })
  await sleep(600)
  addCheck(result, 'Ordinary wheel scrolling reaches About', await evaluate(send, `document.querySelector('#about').getBoundingClientRect().top < innerHeight`))
  await screenshot('about-start')
  await evaluate(send, `document.querySelector('#work').scrollIntoView({behavior:'instant'})`)
  await sleep(500)
  const offscreenFrames = await evaluate(send, `document.querySelector('canvas')?.dataset.frames`)
  await sleep(500)
  addCheck(result, 'WebGL stops rendering outside hero', offscreenFrames === await evaluate(send, `document.querySelector('canvas')?.dataset.frames`))
  const count = await evaluate(send, `document.querySelectorAll('details').length`)
  for (let index = 0; index < count; index++) {
    await evaluate(send, `(() => { const d = document.querySelectorAll('details')[${index}]; d.open=false; d.querySelector('summary').focus(); })()`)
    await key('Enter', 'Enter', 13)
    addCheck(result, `Disclosure ${index + 1} opens with keyboard`, await evaluate(send, `document.querySelectorAll('details')[${index}].open`))
    if (index >= 8) {
      await evaluate(send, `document.querySelectorAll('details')[${index}].scrollIntoView({behavior:'instant'})`)
      await sleep(120)
      await screenshot(`case-study-${index - 7}`)
    }
    await key('Enter', 'Enter', 13)
    addCheck(result, `Disclosure ${index + 1} closes with keyboard`, await evaluate(send, `!document.querySelectorAll('details')[${index}].open`))
  }
  await evaluate(send, `scrollTo({top:0,behavior:'instant'}); document.querySelector('.hero-links a').focus()`)
  await sleep(150)
  addCheck(result, 'Keyboard focus reveals hidden hero actions immediately', await evaluate(send, `getComputedStyle(document.querySelector('.hero-links')).opacity === '1'`))
  const lost = await evaluate(send, `(() => { const canvas=document.querySelector('canvas'); const gl=canvas?.getContext('webgl2'); const ext=gl?.getExtension('WEBGL_lose_context'); if(!ext) return false; ext.loseContext(); return true; })()`)
  await sleep(350)
  addCheck(result, 'Context loss removes canvas and preserves portrait', lost && await evaluate(send, `!document.querySelector('.hero-canvas') && document.querySelector('.hero-portrait img').naturalWidth > 0`))
  await screenshot('context-loss')
  // Browser-level failure injection, not an application-specific bypass.
  const injection = await send('Page.addScriptToEvaluateOnNewDocument', { source: `const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(kind, ...args) { return /webgl/.test(kind) ? null : original.call(this, kind, ...args); };` })
  await send('Page.navigate', { url: baseUrl }); await waitForApp(send); await sleep(500)
  addCheck(result, 'Forced WebGL failure preserves the complete photographic hero', await evaluate(send, `!document.querySelector('.hero-canvas canvas') && document.querySelector('.hero-portrait img').naturalWidth > 0`))
  await evaluate(send, `scrollTo({top:(document.querySelector('#top').offsetHeight-innerHeight)*.8,behavior:'instant'})`)
  await sleep(200); await screenshot('webgl-fallback')
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: injection.identifier })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await send('Page.navigate', { url: baseUrl }); await waitForApp(send)
  addCheck(result, 'Reduced motion shows full hero without loading WebGL', await evaluate(send, `!document.querySelector('canvas') && getComputedStyle(document.querySelector('.hero-links')).opacity === '1' && getComputedStyle(document.querySelector('.hero-stage')).position !== 'sticky'`))
  await screenshot('reduced-motion')
  // A cold document avoids Chrome reusing a previously cached larger srcset candidate.
  await send('Page.navigate', { url: 'about:blank' })
  await send('Network.clearBrowserCache')
  await send('Network.setCacheDisabled', { cacheDisabled: true })
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  await send('Page.navigate', { url: baseUrl }); await waitForApp(send)
  const mobile = await evaluate(send, `({ source: document.querySelector('.hero-portrait img').currentSrc, visible: getComputedStyle(document.querySelector('.hero-links')).opacity, canvas: !!document.querySelector('canvas'), imageRequests: performance.getEntriesByType('resource').filter(r=>/portrait-/.test(r.name)).length, resources: performance.getEntriesByType('resource').filter(r=>/portrait-/.test(r.name)).map(r=>r.name) })`)
  addCheck(result, 'Mobile uses small WebP, one portrait request, complete content, no canvas', mobile.source.includes('480.webp') && mobile.visible === '1' && !mobile.canvas && mobile.imageRequests === 1, mobile)
  await screenshot('mobile')
  await evaluate(send, `document.querySelector('.project-details').open=true; document.querySelector('.project-details').scrollIntoView({behavior:'instant'})`)
  addCheck(result, 'Expanded mobile case study has no overflow', await evaluate(send, `document.documentElement.scrollWidth <= innerWidth`))
  await screenshot('case-study-mobile')
  // Chrome browser zoom can be represented with halved layout viewport + doubled device scale.
  await send('Emulation.setDeviceMetricsOverride', { width: 640, height: 450, deviceScaleFactor: 2, mobile: false })
  await send('Page.navigate', { url: baseUrl }); await waitForApp(send)
  const zoom = await evaluate(send, layoutInspection)
  addCheck(result, '200% desktop zoom equivalent reflows without overflow', zoom.scrollWidth <= 640 && zoom.overflows.length === 0, zoom.overflows)
  await screenshot('zoom-200')
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await send('Page.navigate', { url: baseUrl }); await sleep(1000)
  const nojs = await evaluate(send, `({ h1: document.querySelectorAll('h1').length, projects: document.querySelectorAll('.project').length, experience: document.querySelectorAll('.experience-entry').length, contacts: document.querySelectorAll('.contact-links a').length, loaded: document.querySelector('.hero-portrait img')?.naturalWidth > 0, intro: getComputedStyle(document.querySelector('.hero-intro')).opacity, nav: document.querySelector('.nav-nojs')?.getBoundingClientRect().height, header: getComputedStyle(document.querySelector('.site-header')).position, toggle: getComputedStyle(document.querySelector('.nav-toggle')).display, overflow: document.documentElement.scrollWidth > innerWidth })`)
  addCheck(result, 'No-JavaScript HTML contains visible portrait, projects, experience, contacts and navigation', nojs.h1 === 1 && nojs.projects === 3 && nojs.experience === 2 && nojs.contacts === 2 && nojs.loaded && nojs.intro === '1' && nojs.nav > 0 && nojs.header === 'relative' && nojs.toggle === 'none' && !nojs.overflow, nojs)
  await screenshot('no-javascript')
  await send('Emulation.setScriptExecutionDisabled', { value: false })
}
