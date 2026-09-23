import { identity, contactLinks } from '../src/data/portfolio.ts'
export function siteOrigin(value) {
  if (!value) return null
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('VITE_SITE_URL must be a plain HTTPS origin, e.g. https://your-deployment.vercel.app')
  return url.origin
}
export function metadata(origin) {
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: identity.name, jobTitle: identity.role, sameAs: contactLinks.filter(link => link.external).map(link => link.href), ...(origin ? { url: `${origin}/`, image: `${origin}/images/portrait-1122.jpg` } : {}) }
  const absolute = origin ? `<link rel="canonical" href="${origin}/" /><meta property="og:url" content="${origin}/" /><meta property="og:image" content="${origin}/social-preview.jpg" /><meta name="twitter:image" content="${origin}/social-preview.jpg" />` : ''
  return `${absolute}<script type="application/ld+json">${JSON.stringify(person).replaceAll('<', '\\u003c')}</script>`
}
