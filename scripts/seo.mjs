export function siteOrigin(value) {
  if (!value?.trim()) return null
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_SITE_URL must be an HTTPS origin without a path, credentials, query, or fragment.')
  }
  return url.origin
}
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
export function seoHead({ origin, identity, contactLinks, metadata }) {
  const person = {
    '@context': 'https://schema.org', '@type': 'Person', name: identity.name,
    jobTitle: identity.role, description: identity.positioning,
    sameAs: contactLinks.filter(link => link.kind === 'profile').map(link => link.href),
    ...(origin ? { url: `${origin}/`, image: `${origin}${metadata.socialImage}` } : {}),
  }
  return [
    `<title>${escape(metadata.title)}</title>`,
    `<meta name="description" content="${escape(metadata.description)}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:title" content="${escape(metadata.title)}" />`,
    `<meta property="og:description" content="${escape(metadata.description)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escape(metadata.description)}" />`,
    ...(origin ? [
      `<link rel="canonical" href="${escape(origin)}/" />`,
      `<meta property="og:url" content="${escape(origin)}/" />`,
      `<meta property="og:image" content="${escape(origin)}${metadata.socialImage}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${escape(metadata.socialImageAlt)}" />`,
      `<meta name="twitter:image" content="${escape(origin)}${metadata.socialImage}" />`,
      `<meta name="twitter:image:alt" content="${escape(metadata.socialImageAlt)}" />`,
    ] : []),
    `<script type="application/ld+json">${JSON.stringify(person).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n    ')
}
