import test from 'node:test'
import assert from 'node:assert/strict'
import { seoHead, siteOrigin } from './seo.mjs'

const fixture = {
  identity: { name: 'Name', role: 'Role', positioning: 'Position' },
  contactLinks: [{ kind: 'profile', href: 'https://github.com/test' }],
  metadata: { title: 'Name & role', description: 'A "description"', socialImage: '/social-preview.png', socialImageAlt: 'Preview' },
}
test('unconfigured origin never invents an absolute URL or canonical', () => {
  const html = seoHead({ ...fixture, origin: siteOrigin('') })
  assert.doesNotMatch(html, /rel="canonical"|property="og:url"|property="og:image"|name="twitter:image"/)
  assert.match(html, /application\/ld\+json/)
  assert.match(html, /&amp;/)
  assert.match(html, /&quot;/)
})
test('configured domain is used consistently across metadata', () => {
  const origin = siteOrigin('https://portfolio.test/')
  const html = seoHead({ ...fixture, origin })
  assert.equal(origin, 'https://portfolio.test')
  assert.match(html, /rel="canonical" href="https:\/\/portfolio.test\/"/)
  assert.match(html, /property="og:image" content="https:\/\/portfolio.test\/social-preview.png"/)
  assert.match(html, /name="twitter:image" content="https:\/\/portfolio.test\/social-preview.png"/)
})
test('invalid production origins fail loudly', () => {
  for (const value of ['bad', 'http://portfolio.test', 'https://portfolio.test/path', 'https://user:pass@portfolio.test', 'https://portfolio.test/?query=1', 'https://portfolio.test/#hash']) assert.throws(() => siteOrigin(value))
})
