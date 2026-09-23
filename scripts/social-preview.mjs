import { spawn } from 'node:child_process'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { ChromeProtocol, debuggingUrl, evaluate } from './chrome-protocol.mjs'
const directory = path.resolve('.qa/social')
await mkdir(directory, { recursive: true })
const font = (await readFile('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')).toString('base64')
const portrait = (await readFile('public/images/portrait-800.webp')).toString('base64')
const html = `<!doctype html><html><head><style>
@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#101112;color:#eeefec;font-family:Manrope,sans-serif;overflow:hidden}main{position:relative;height:100%;padding:52px 64px}.portrait{position:absolute;right:64px;top:60px;width:402px;height:530px;object-fit:cover;object-position:50% 24%;filter:grayscale(1) brightness(.8);mask-image:linear-gradient(#000 70%,transparent)}.ring{position:absolute;right:12px;top:16px;width:510px;height:550px;border:1px solid #abc2d432;border-radius:50%;transform:rotate(-23deg)}.ring.second{transform:rotate(28deg);height:390px;top:110px;width:620px;right:-44px}.name{position:relative;font-size:14px;letter-spacing:2px;color:#bfc7cc;margin:16px 0 52px}h1{position:relative;font-size:137px;letter-spacing:-10px;line-height:.97;font-weight:500;margin:0}h1 span{color:#abc2d4}.intro{position:relative;font-size:23px;line-height:1.5;letter-spacing:-.6px;max-width:450px;margin:30px 0}.footer{position:absolute;left:64px;right:64px;bottom:32px;border-top:1px solid #303336;padding-top:18px;font-size:12px;letter-spacing:1px;color:#969b9f}
</style></head><body><main><div class="ring"></div><div class="ring second"></div><img class="portrait" src="data:image/webp;base64,${portrait}"><p class="name">DWARAKNATH BALAJI</p><h1>AI<br>ENGINEER<span>.</span></h1><p class="intro">Building intelligent systems<br>that retrieve, reason and act.</p><div class="footer">RAG / LLMs / AGENTIC SYSTEMS / EVALUATION</div></main></body></html>`
const chrome = spawn(process.env.CHROME_BIN || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome'), ['--headless=new', '--no-sandbox', '--remote-debugging-port=0', `--user-data-dir=${directory}/profile`, 'about:blank'], { stdio: ['ignore','ignore','pipe'] })
let protocol
try {
  protocol = await ChromeProtocol.connect(await debuggingUrl(chrome), () => {})
  chrome.stderr.resume()
  const { targetId } = await protocol.request('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await protocol.request('Target.attachToTarget', { targetId, flatten: true })
  const send = protocol.session(sessionId)
  await send('Emulation.setDeviceMetricsOverride', { width:1200, height:630, deviceScaleFactor:1, mobile:false })
  await send('Page.navigate', { url: `data:text/html;base64,${Buffer.from(html).toString('base64')}` })
  await evaluate(send, `new Promise(resolve => { const ready = async () => { await document.fonts.ready; await Promise.all([...document.images].map(image=>image.decode())); resolve(true) }; if(document.readyState === 'complete') ready(); else window.addEventListener('load',ready,{once:true}) })`)
  const { data } = await send('Page.captureScreenshot', { format:'png' })
  await writeFile(`${directory}/social-preview.png`, Buffer.from(data,'base64'))
  await sharp(Buffer.from(data,'base64')).jpeg({ quality:88, mozjpeg:true }).toFile('public/social-preview.jpg')
  console.log('Generated public/social-preview.jpg: 1200 × 630, actual portrait, embedded Manrope.')
} finally { protocol?.close(); chrome.kill('SIGTERM') }
