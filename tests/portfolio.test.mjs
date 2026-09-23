import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { heroStages } from '../src/hooks/hero-progress.ts'
import { projects, experience, contactLinks, navigation } from '../src/data/portfolio.ts'
import { metadata, siteOrigin } from '../scripts/seo.mjs'

test('scroll stages clamp, stay monotonic, reveal sequentially and settle', () => {
  assert.equal(heroStages(-1).overall, 0)
  assert.equal(heroStages(2).overall, 1)
  assert.equal(heroStages(.1).ai, 0)
  assert.equal(heroStages(.35).engineer, 1)
  assert.equal(heroStages(.35).introduction, 0)
  assert.equal(heroStages(.5).cta, 0)
  assert.equal(heroStages(.75).cta, 1)
  for (let i = 1; i <= 100; i++) for (const key of Object.keys(heroStages(0))) assert.ok(heroStages(i/100)[key] >= heroStages((i-1)/100)[key])
})
test('conceptual content cannot accidentally claim completion or outcomes', () => {
  for (const project of projects) {
    assert.equal(project.status, 'Project direction')
    assert.ok(project.technicalApproach.length)
    assert.equal(project.verifiedOutcomes, undefined)
    assert.equal(project.repositoryUrl, undefined)
  }
  for (const entry of experience) { assert.ok(entry.primaryRole); assert.equal(entry.startDate, undefined) }
})
test('contact behavior is explicit, valid and accessible', () => {
  for (const contact of contactLinks) {
    assert.ok(contact.id && contact.accessibleLabel && contact.displayValue)
    assert.equal(new URL(contact.href).protocol, contact.kind === 'email' ? 'mailto:' : 'https:')
    if (contact.external) assert.match(contact.accessibleLabel, /new tab/)
  }
})
test('SEO only emits domain-dependent metadata for a valid production origin', () => {
  assert.equal(siteOrigin(''), null)
  assert.doesNotMatch(metadata(null), /canonical|og:url|og:image"/)
  assert.equal(siteOrigin('https://example.com/'), 'https://example.com')
  for (const invalid of ['http://example.com', 'https://example.com/path', 'https://a:b@example.com', 'https://example.com/?x=1']) assert.throws(() => siteOrigin(invalid))
  assert.match(metadata('https://example.com'), /canonical/)
})
test('production HTML contains complete semantic content before JavaScript', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  assert.equal((html.match(/<h1\b/g) || []).length, 1)
  for (const { id } of navigation) assert.ok(html.includes(`id="${id}"`))
  for (const project of projects) assert.ok(html.includes(project.title.replaceAll('&','&amp;')))
  assert.match(html, /id="capabilities"/)
  assert.match(html, /application\/ld\+json/)
  assert.match(html, /<picture>/)
  assert.doesNotMatch(html, /enable JavaScript|framer-motion|tailwindcss/)
})
test('untouched original remains recoverable', async () => {
  assert.equal(createHash('sha256').update(await readFile('dwaraknath-portrait.png')).digest('hex'), 'e8704e0898695d2ce09d5ce9e555f7a5e7628e5b6f10aec8672fc22afa00f696')
})

test('core text palette meets WCAG AA normal-text contrast', () => {
  const luminance = hex => {
    const channels = hex.match(/\w\w/g).map(part => parseInt(part, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722
  }
  for (const [text, background] of [['eeefec', '101112'], ['969b9f', '101112'], ['abc2d4', '101112'], ['afb4b8', '141618'], ['3e4b55', 'becad2']]) {
    const a = luminance(text), b = luminance(background)
    assert.ok((Math.max(a,b) + .05) / (Math.min(a,b) + .05) >= 4.5)
  }
})
