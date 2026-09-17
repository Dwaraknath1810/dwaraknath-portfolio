import { spawn } from 'node:child_process'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { once } from 'node:events'
import { ChromeProtocol, debuggingUrl, evaluate } from './chrome.mjs'

// Browser canvas preserves the real photo and uses the project's actual local font.
const chromeBinary = process.env.CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : '/usr/bin/google-chrome')
await mkdir('.qa/brand-profile', { recursive: true })
const chrome = spawn(chromeBinary, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${process.cwd()}/.qa/brand-profile`, '--no-first-run', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] })
let protocol
try {
  protocol = await ChromeProtocol.connect(await debuggingUrl(chrome), () => {})
  chrome.stderr.resume()
  const { targetId } = await protocol.request('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await protocol.request('Target.attachToTarget', { targetId, flatten: true })
  const send = protocol.session(sessionId)
  const font = (await readFile('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')).toString('base64')
  const portrait = (await readFile('src/assets/dwaraknath-portrait.jpg')).toString('base64')
  const assets = await evaluate(send, `(async () => {
    const font = new FontFace('Manrope', 'url(data:font/woff2;base64,${font})', { weight: '200 800' });
    document.fonts.add(await font.load());
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#101112'; ctx.fillRect(0,0,1200,630);
    const image = new Image(); image.src = 'data:image/jpeg;base64,${portrait}'; await image.decode();
    ctx.filter = 'grayscale(1)'; ctx.drawImage(image, 675, 35, 475, 594); ctx.filter = 'none';
    const shade = ctx.createLinearGradient(650,0,1050,0); shade.addColorStop(0,'#101112'); shade.addColorStop(1,'#10111200');
    ctx.fillStyle = shade; ctx.fillRect(640,0,560,630);
    const fade = ctx.createLinearGradient(0,400,0,630); fade.addColorStop(0,'#10111200'); fade.addColorStop(1,'#101112');
    ctx.fillStyle = fade; ctx.fillRect(0,400,1200,230);
    ctx.fillStyle = '#abc2d4'; ctx.fillRect(58,58,6,6);
    ctx.font = '500 20px Manrope'; ctx.fillText('DWARAKNATH BALAJI', 80,70);
    ctx.fillStyle = '#eeefec'; ctx.font = '540 110px Manrope'; ctx.fillText('AI',55,240); ctx.fillText('ENGINEER',55,354);
    ctx.fillStyle = '#abc2d4'; ctx.fillRect(616,337,15,15);
    ctx.fillStyle = '#c1c7cc'; ctx.font = '400 26px Manrope'; ctx.fillText('Building intelligent systems',60,442); ctx.fillText('that retrieve, reason and act.',60,482);
    ctx.fillStyle = '#454e55'; ctx.fillRect(60,540,1080,1);
    ctx.fillStyle = '#abc2d4'; ctx.font = '500 17px Manrope'; ctx.fillText('RAG / LLMs / Agentic Systems / Evaluation',60,582);
    const social = canvas.toDataURL('image/png').split(',')[1];
    const icons = {};
    for (const size of [64,180]) {
      canvas.width = canvas.height = size; ctx.fillStyle = '#101112'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle = '#eeefec'; ctx.font = '600 ' + (size*.48) + 'px Manrope'; ctx.fillText('db',size*.15,size*.67);
      ctx.fillStyle = '#abc2d4'; ctx.fillRect(size*.76,size*.61,size*.06,size*.06);
      icons[size] = canvas.toDataURL('image/png').split(',')[1];
    }
    return {social,icons};
  })()`)
  await writeFile('public/social-preview.png', Buffer.from(assets.social, 'base64'))
  await writeFile('public/apple-touch-icon.png', Buffer.from(assets.icons[180], 'base64'))
  await writeFile('public/favicon.png', Buffer.from(assets.icons[64], 'base64'))
  console.log('Created social preview and icons using the real portrait, Manrope, and the site palette.')
} finally {
  protocol?.close()
  if (chrome.exitCode === null && chrome.signalCode === null) {
    const exited = once(chrome, 'exit')
    chrome.kill('SIGTERM')
    await exited
  }
  await rm('.qa/brand-profile', { recursive: true, force: true })
}
