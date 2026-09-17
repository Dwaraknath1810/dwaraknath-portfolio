import test from 'node:test'
import assert from 'node:assert/strict'
import { validateContent } from './validate-content.mjs'
const base = { navigation: [{ id: 'about' }], sectionIds: ['about'], projects: [], experience: [], contactLinks: [] }
test('missing factual content is accepted without placeholders', () => assert.doesNotThrow(() => validateContent({ ...base, projects: [{ title: 'Concept', status: 'Project direction' }], experience: [{ company: 'Company', primaryRole: 'Role', current: true }] })))
test('invalid section targets, empty content, and fake URLs fail before deployment', () => {
  assert.throws(() => validateContent({ ...base, navigation: [{ id: 'missing' }] }))
  assert.throws(() => validateContent({ ...base, projects: [{ title: 'Concept', role: ' ' }] }))
  assert.throws(() => validateContent({ ...base, projects: [{ title: 'Concept', repositoryUrl: 'https://example.com/repo' }] }))
})
test('dates must exist on the calendar and form a consistent timeline', () => {
  for (const date of ['2024-13', '2023-02-29', 'yesterday']) assert.throws(() => validateContent({ ...base, experience: [{ company: 'Company', startDate: date }] }))
  assert.doesNotThrow(() => validateContent({ ...base, experience: [{ company: 'Company', startDate: '2024-02-29' }] }))
  assert.throws(() => validateContent({ ...base, experience: [{ company: 'Company', current: true, endDate: '2024-01' }] }))
})
