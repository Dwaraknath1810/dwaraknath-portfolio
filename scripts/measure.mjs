import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const root = process.argv[2] || 'dist'
async function inventory(directory) {
  const results = []
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, item.name)
    if (item.isDirectory()) results.push(...await inventory(filename))
    else {
      const data = await readFile(filename)
      results.push({ file: path.relative(root, filename), bytes: (await stat(filename)).size, gzipBytes: gzipSync(data).length })
    }
  }
  return results
}
const files = (await inventory(root)).sort((a, b) => b.bytes - a.bytes)
const totals = suffix => files.filter(f => f.file.endsWith(suffix)).reduce((total, file) => ({ bytes: total.bytes + file.bytes, gzipBytes: total.gzipBytes + file.gzipBytes }), { bytes: 0, gzipBytes: 0 })
const payload = portrait => {
  const initial = files.filter(f => /\.(js|css|woff2)$/.test(f.file) || f.file === 'index.html' || f.file === 'favicon.png' || (portrait.test(f.file) && f.file.endsWith('.webp')))
  return { files: initial.map(f => f.file), bytes: initial.reduce((sum, f) => sum + f.bytes, 0), estimatedGzipBytes: initial.reduce((sum, f) => sum + (/\.(html|js|css)$/.test(f.file) ? f.gzipBytes : f.bytes), 0) }
}
const report = { units: 'bytes; gzip level uses Node zlib default. Payload is a cold-cache estimate, not a network timing.', javascript: totals('.js'), css: totals('.css'), fonts: totals('.woff2'), mobile1x: payload(/portrait-small-/), desktop1x: payload(/portrait-medium-/), desktop2x: payload(/portrait-(?!small-|medium-)/), files }
await mkdir('.qa', { recursive: true })
await writeFile('.qa/production-sizes.json', JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
