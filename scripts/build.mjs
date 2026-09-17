import { build, loadEnv } from 'vite'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { seoHead, siteOrigin } from './seo.mjs'
import { validateContent } from './validate-content.mjs'

const env = { ...loadEnv('production', process.cwd(), 'VITE_'), ...process.env }
const origin = siteOrigin(env.VITE_SITE_URL)
await build()
await build({ build: { ssr: 'src/entry-server.tsx', outDir: '.prerender', copyPublicDir: false } })
const content = await import(pathToFileURL(resolve('.prerender/entry-server.js')))
validateContent(content)
const { render, identity, contactLinks, siteMetadata } = content
let html = await readFile('dist/index.html', 'utf8')
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
html = html.replace('<!--seo-head-->', seoHead({ origin, identity, contactLinks, metadata: siteMetadata }))
await writeFile('dist/index.html', html)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`)
if (origin) await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`)
await rm('.prerender', { recursive: true, force: true })
console.log(`Prerendered all portfolio sections. ${origin ? `Canonical origin: ${origin}` : 'VITE_SITE_URL is unset: canonical, absolute social URLs, and sitemap are intentionally omitted.'}`)
