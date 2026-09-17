import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, stat, readdir } from 'node:fs/promises'

const html = await readFile('dist/index.html', 'utf8')
test('static HTML includes the real content, landmarks, and all anchor targets', () => {
  for (const id of ['top', 'about', 'expertise', 'work', 'experience', 'capabilities', 'philosophy', 'contact']) assert.ok(html.includes(`id="${id}"`), id)
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), match[1])
  assert.equal((html.match(/<h1\b/g) || []).length, 1)
  assert.equal((html.match(/<main\b/g) || []).length, 1)
  assert.ok(html.includes('PHOENIX ICT SOLUTIONS') && html.includes('ZSCALER'))
  assert.equal((html.match(/>Project direction</g) || []).length, 3)
  assert.doesNotMatch(html, /Unknown|>N\/A<|href="(?:#|)"/)
  assert.doesNotMatch(html, /data-motion="enabled"|opacity:0/)
})
test('every local prerendered asset exists and the original is not shipped', async () => {
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) {
    const pathname = match[1]
    assert.ok((await stat(`dist${pathname}`)).isFile(), pathname)
  }
  const files = await readdir('dist/assets')
  assert.ok(files.every(file => !file.endsWith('.png')))
  assert.ok((await stat('dwaraknath-portrait.png')).size > 1_000_000)
})
test('production metadata is parseable and has no fake domain', async () => {
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]
  assert.ok(json)
  const person = JSON.parse(json)
  assert.equal(person['@type'], 'Person')
  assert.equal(person.name, 'DWARAKNATH BALAJI')
  assert.doesNotMatch(html, /example\.com|your-domain/)
  assert.match(await readFile('dist/robots.txt', 'utf8'), /User-agent: \*/)
})
test('browser dependencies and payload stay within the lightweight budget', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'))
  for (const name of ['framer-motion', 'tailwindcss', '@tailwindcss/vite', 'three', 'gsap']) assert.ok(!pkg.dependencies?.[name] && !pkg.devDependencies?.[name])
  const { gzipSync } = await import('node:zlib')
  let gzipBytes = 0
  for (const file of await readdir('dist/assets')) if (file.endsWith('.js')) gzipBytes += gzipSync(await readFile(`dist/assets/${file}`)).length
  assert.ok(gzipBytes < 76_000, `JavaScript gzip budget exceeded: ${gzipBytes}`)
})
