const arrayFields = ['focus', 'technicalApproach', 'responsibilities', 'decisions', 'constraints', 'challenges', 'outcomes', 'stack', 'additionalRoles', 'contributions', 'highlights', 'technologies']
function validateRecord(record, label) {
  for (const [field, value] of Object.entries(record)) {
    if (typeof value === 'string' && !value.trim()) throw new Error(`${label}.${field}: omit empty optional fields`)
    if (arrayFields.includes(field) && value?.some(item => typeof item !== 'string' || !item.trim())) throw new Error(`${label}.${field}: list entries must contain real content`)
    if (field.endsWith('Url') && value) {
      if (field === 'caseStudyUrl' && value.startsWith('/') && !value.startsWith('//')) continue
      const url = new URL(value)
      if (url.protocol !== 'https:' || url.username || url.password || /example\.(com|org)|placeholder|your-domain/.test(url.hostname)) throw new Error(`${label}.${field}: supply a real HTTPS destination`)
    }
  }
}
function validDate(value) {
  if (!/^\d{4}-\d{2}(?:-\d{2})?$/.test(value)) return false
  const full = value.length === 7 ? `${value}-01` : value
  const parsed = new Date(`${full}T00:00:00Z`)
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0,10) === full
}
export function validateContent({ navigation, sectionIds, projects, experience, contactLinks }) {
  const ids = new Set()
  for (const item of navigation) {
    if (!sectionIds.includes(item.id) || ids.has(item.id)) throw new Error(`Invalid or duplicate navigation target: ${item.id}`)
    ids.add(item.id)
  }
  for (const project of projects) validateRecord(project, project.title)
  for (const entry of experience) {
    validateRecord(entry, entry.company)
    for (const field of ['startDate', 'endDate']) if (entry[field] && !validDate(entry[field])) throw new Error(`${entry.company}.${field}: expected a real ISO year-month or date`)
    if (entry.current && entry.endDate) throw new Error(`${entry.company}: current roles cannot have an end date`)
    if (entry.startDate && entry.endDate && entry.startDate > entry.endDate) throw new Error(`${entry.company}: dates are reversed`)
  }
  for (const link of contactLinks) {
    validateRecord(link, link.id)
    if (link.kind === 'email' && (link.href !== `mailto:${link.displayValue}` || link.external)) throw new Error('Email display and destination must agree')
    if (link.kind === 'profile' && (!link.href.startsWith('https://') || !link.external || !link.accessibleLabel.includes('new tab'))) throw new Error('Profile must use HTTPS and disclose new-tab behavior')
  }
}
