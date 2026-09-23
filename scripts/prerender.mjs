import { createServer, loadEnv } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import { metadata, siteOrigin } from './seo.mjs'
const origin = siteOrigin(process.env.VITE_SITE_URL || loadEnv('production', process.cwd(), 'VITE_').VITE_SITE_URL)
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx')
  const template = await readFile('dist/index.html', 'utf8')
  const html = template.replace('<div id="root"></div>', `<div id="root">${render()}</div>`).replace('<!-- production-metadata -->', metadata(origin))
  await writeFile('dist/index.html', html)
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`)
  if (origin) await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`)
  console.log(`Prerendered complete portfolio HTML. Production origin: ${origin || 'omitted (VITE_SITE_URL unset)'}`)
} finally { await server.close() }
