import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const base = process.cwd()
const read = path => readFileSync(resolve(base,path),'utf8')
const story = read('src/cinematic/CinematicStory.tsx')
const quickView = read('src/cinematic/RecruiterOverview.tsx')
const nav = read('src/cinematic/SceneNavigation.tsx')
const project = read('src/cinematic/ProjectCard.tsx')
const portfolio = read('src/data/cinematic.ts')
const page = read('index.html')

const requiredFiles = [
  'public/Dwaraknath_Balaji_AI_Engineer_Resume.pdf',
  'public/hero-portrait-cutout.webp',
  'public/openai-blossom.svg',
  'public/projects/agent-intelligence.svg',
  'public/projects/jarvis.svg',
  'public/projects/enterprise-rag-flow.svg',
  'public/projects/agentic-evaluation-flow.svg',
  'public/projects/driver-drowsiness-flow.svg',
  'public/projects/sentiment-classification-flow.svg',
  'public/projects/driver-drowsiness-training-accuracy.png',
  'public/projects/driver-drowsiness-training-loss.png',
]
for (const file of requiredFiles) {
  const absolute = resolve(base,file)
  assert(existsSync(absolute), `Required portfolio asset missing: ${file}`)
  assert(statSync(absolute).size > 50, `Asset looks empty: ${file}`)
}
const resume = readFileSync(resolve(base,requiredFiles[0]))
assert(resume.subarray(0,5).toString('ascii') === '%PDF-', 'Resume is not a readable PDF binary')

assert(story.includes('<RecruiterOverview/>'), 'Recruiter brief is not mounted')
assert(story.includes('AI ENGINEER <span>'), 'Hero role must be AI Engineer')
assert(!/AI SOFTWARE ENGINEER/i.test(story), 'Outdated hero role found')
assert(portfolio.includes("title:'AI Engineer'"), 'Published career title must match resume')
assert(!/AI Software Engineer/.test(portfolio), 'Outdated position title found in portfolio data')
assert(!/AI Software Engineer/.test(page), 'Outdated professional title in SEO metadata')
assert(story.includes('href="#snapshot"'), 'Hero fast track link is missing')
assert(quickView.includes('id="snapshot"'), 'Recruiter brief anchor does not exist')
assert(nav.includes("id: 'snapshot'"), 'Recruiter brief not present in scene navigation')
assert(quickView.includes('featuredProjects.filter'), 'Public project list is no longer source-driven')
assert(quickView.includes('project.sourceUrl'), 'No evidence links in recruiter brief')
assert(story.includes('Dwaraknath_Balaji_AI_Engineer_Resume.pdf'), 'Resume CTA in opening/finale is missing')
assert(project.includes('project.diagram'), 'Case-study architecture visual is missing')
assert(portfolio.includes("slug:'agent-intelligence', kind:'personal'") && portfolio.includes("slug:'jarvis',kind:'personal'"), 'Flagship projects missing')
assert(story.includes('project.kind===filter'), 'Project filtering must use explicit categories')
assert(!/github\.com\/Dwaraknath1810\/(?:multi-agent-ai|jarvis)\b/i.test(portfolio), 'Private source links must not be published')

for (const name of ['src/cinematic/CinematicStory.tsx','src/cinematic/RecruiterOverview.tsx','src/cinematic/ProjectCard.tsx','src/data/cinematic.ts','index.html']) {
  assert(!/zara\s*[-_]?\s*(?:lm|chat)/i.test(read(name)), `Private platform name leaked into ${name}`)
}

const ldJson = page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
assert(ldJson, 'Missing structured data block')
const schema = JSON.parse(ldJson)
assert(schema['@type'] === 'Person' && schema.sameAs?.includes('https://github.com/Dwaraknath1810'),'Person metadata invalid')
assert(portfolio.includes('Driver-drowsiness-detection'), 'Public driver project link missing')
assert(portfolio.includes('Sentimental-analysis'), 'Public sentiment project link missing')
console.log('Portfolio checks passed: resume PDF, key media, quick brief, source links, structured data and confidentiality.')
