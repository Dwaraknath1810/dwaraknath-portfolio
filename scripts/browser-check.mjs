import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

// Local Chrome only. Uses the WebSocket implementation included in modern Node.
// Run after starting Vite: node scripts/browser-check.mjs
const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5173'
const chromeBinary = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const outputDirectory = path.resolve('.qa')
const viewports = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 1000 },
  { width: 1280, height: 832 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
]

class ChromeProtocol {
  constructor(socket, onEvent) {
    this.socket = socket
    this.nextId = 1
    this.pending = new Map()
    this.onEvent = onEvent
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data))
      if (message.id) {
        const request = this.pending.get(message.id)
        if (!request) return
        clearTimeout(request.timeout)
        this.pending.delete(message.id)
        if (message.error) request.reject(new Error(`${request.method}: ${message.error.message}`))
        else request.resolve(message.result)
      } else {
        this.onEvent(message)
      }
    })
    socket.addEventListener('close', () => this.rejectPending('Chrome WebSocket closed'))
    socket.addEventListener('error', () => this.rejectPending('Chrome WebSocket error'))
  }

  static async connect(url, onEvent) {
    const socket = new WebSocket(url)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.close()
        reject(new Error('Timed out connecting to Chrome'))
      }, 15_000)
      socket.addEventListener('open', () => { clearTimeout(timeout); resolve() }, { once: true })
      socket.addEventListener('error', () => {
        clearTimeout(timeout)
        reject(new Error('Could not connect to Chrome'))
      }, { once: true })
    })
    return new ChromeProtocol(socket, onEvent)
  }

  request(method, params = {}, sessionId, timeoutMs = 15_000) {
    return new Promise((resolve, reject) => {
      if (this.socket.readyState !== WebSocket.OPEN) {
        reject(new Error(`Chrome is not connected: ${method}`))
        return
      }
      const id = this.nextId++
      const timeout = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`Timed out after ${timeoutMs}ms: ${method}`))
      }, timeoutMs)
      this.pending.set(id, { resolve, reject, timeout, method })
      try {
        this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
      } catch (error) {
        clearTimeout(timeout)
        this.pending.delete(id)
        reject(error)
      }
    })
  }

  session(sessionId) {
    return (method, params = {}, timeoutMs = 15_000) => this.request(method, params, sessionId, timeoutMs)
  }

  rejectPending(message) {
    for (const { reject, timeout } of this.pending.values()) {
      clearTimeout(timeout)
      reject(new Error(message))
    }
    this.pending.clear()
  }

  close() {
    this.rejectPending('Chrome session closed during cleanup')
    this.socket.close()
  }
}

function debuggingUrl(chrome) {
  return new Promise((resolve, reject) => {
    let stderr = ''
    const timeout = setTimeout(() => finish(new Error('Timed out waiting for Chrome DevTools endpoint')), 20_000)
    function finish(error, url) {
      clearTimeout(timeout)
      chrome.stderr.off('data', onData)
      chrome.off('error', onError)
      chrome.off('exit', onExit)
      if (error) reject(new Error(`${error.message}\n${stderr.slice(-2000)}`))
      else resolve(url)
    }
    function onData(chunk) {
      stderr = (stderr + String(chunk)).slice(-12_000)
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)
      if (match) finish(null, match[1])
    }
    function onError(error) { finish(error) }
    function onExit(code, signal) { finish(new Error(`Chrome exited before startup: ${code ?? signal}`)) }
    chrome.stderr.on('data', onData)
    chrome.once('error', onError)
    chrome.once('exit', onExit)
  })
}

async function evaluate(send, expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
  }
  return result.result.value
}

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
  await writeFile(path.join(outputDirectory, `${viewport.width}-hero.png`), Buffer.from(hero.data, 'base64'))
  const metrics = await send('Page.getLayoutMetrics')
  const size = metrics.cssContentSize || metrics.contentSize
  const full = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 },
  }, 30_000)
  await writeFile(path.join(outputDirectory, `${viewport.width}-full.png`), Buffer.from(full.data, 'base64'))
  return { hero: `.qa/${viewport.width}-hero.png`, fullPage: `.qa/${viewport.width}-full.png` }
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
    portraitOpacity: getComputedStyle(document.querySelector('.hero-portrait')).opacity,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior
  })`)
  addCheck(report.standardMotion, 'Normal-motion hero finishes visibly and enables smooth scrolling',
    !entrance.reduced && entrance.titleOpacity === '1' && entrance.portraitOpacity === '1' && entrance.scrollBehavior === 'smooth', entrance)

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
