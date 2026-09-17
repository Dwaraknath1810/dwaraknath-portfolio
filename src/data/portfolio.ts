export interface Identity {
  readonly name: string
  readonly role: string
  readonly positioning: string
  readonly supportingLine: string
  readonly location: string
}

export interface NavigationItem {
  readonly id: Exclude<SectionId, 'top'>
  readonly label: string
}

export interface ExpertiseArea {
  readonly number: string
  readonly title: string
  readonly description: string
}

export type ProjectKind = 'retrieval' | 'agents' | 'evaluation'

export type WebUrl = `https://${string}`
export type CaseStudyUrl = WebUrl | `/${string}`

export interface ProjectMedia {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly caption?: string
}

export interface Project {
  readonly number: string
  readonly title: string
  readonly description: string
  readonly focus: readonly string[]
  readonly kind: ProjectKind
  readonly status: 'Project direction' | 'In progress' | 'Completed'
  readonly projectType?: string
  readonly objective?: string
  readonly context?: string
  readonly role?: string
  readonly responsibilities?: readonly string[]
  readonly architecture?: string
  readonly technicalApproach?: readonly string[]
  readonly decisions?: readonly string[]
  readonly constraints?: readonly string[]
  readonly challenges?: readonly string[]
  readonly evaluation?: string
  readonly outcomes?: readonly string[]
  readonly stack?: readonly string[]
  readonly media?: readonly ProjectMedia[]
  readonly repositoryUrl?: WebUrl
  readonly demoUrl?: WebUrl
  readonly caseStudyUrl?: CaseStudyUrl
}

export interface ExperienceEntry {
  readonly company: string
  readonly primaryRole: string
  readonly additionalRoles?: readonly string[]
  readonly current: boolean
  // ISO year-month, or ISO full date. Omit when not supplied.
  readonly startDate?: string
  readonly endDate?: string
  readonly location?: string
  readonly summary?: string
  readonly responsibilities?: readonly string[]
  readonly contributions?: readonly string[]
  readonly highlights?: readonly string[]
  readonly technologies?: readonly string[]
  readonly companyUrl?: WebUrl
}

export interface CapabilityGroup {
  readonly title: string
  readonly items: readonly string[]
}

export interface PhilosophyPrinciple {
  readonly word: string
  readonly description: string
}

interface ContactBase {
  readonly id: string
  readonly label: string
  readonly displayValue: string
  readonly accessibleLabel: string
}
export type ContactLink = ContactBase & (
  | { readonly kind: 'email'; readonly href: `mailto:${string}`; readonly external: false }
  | { readonly kind: 'profile'; readonly href: WebUrl; readonly external: true }
)

export const sectionIds = ['top', 'about', 'expertise', 'work', 'experience', 'capabilities', 'philosophy', 'contact'] as const
export type SectionId = typeof sectionIds[number]

export const identity: Identity = {
  name: 'DWARAKNATH BALAJI',
  role: 'AI ENGINEER',
  positioning: 'Building intelligent systems that retrieve, reason and act.',
  supportingLine: 'RAG / LLMs / Agentic Systems / Evaluation',
  location: 'India',
}

export const aboutStatement =
  'I engineer AI systems that combine retrieval, reasoning, evaluation, and software engineering to turn information into dependable intelligent experiences.'

export const navigation: readonly NavigationItem[] = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'contact', label: 'Contact' },
]

export const expertise: readonly ExpertiseArea[] = [
  {
    number: '01',
    title: 'Retrieval-Augmented Generation',
    description: 'Connecting relevant source material to grounded answer generation.',
  },
  {
    number: '02',
    title: 'Large Language Models',
    description: 'Shaping language model behavior around context, intent, and useful output.',
  },
  {
    number: '03',
    title: 'Agentic AI',
    description: 'Connecting reasoning to tools, structured execution, and workflows.',
  },
  {
    number: '04',
    title: 'LLM Evaluation',
    description: 'Examining correctness, groundedness, and response quality.',
  },
  {
    number: '05',
    title: 'Semantic Search',
    description: 'Finding relevant information through meaning and context.',
  },
  {
    number: '06',
    title: 'Knowledge Base Systems',
    description: 'Organizing information for retrieval and dependable AI experiences.',
  },
  {
    number: '07',
    title: 'AI Engineering',
    description: 'Bringing models, retrieval, and evaluation into coherent systems.',
  },
  {
    number: '08',
    title: 'Software Engineering',
    description: 'Building the applications, interfaces, and integrations around intelligence.',
  },
]

export const projects: readonly Project[] = [
  {
    number: '01',
    title: 'Enterprise RAG & Knowledge Platform',
    description:
      'A document-grounded AI system focused on retrieval quality, knowledge bases, evaluation, and reliable answer generation.',
    focus: ['RAG', 'Semantic Search', 'LLM Evaluation', 'Knowledge Bases'],
    kind: 'retrieval',
    status: 'Project direction',
    technicalApproach: [
      'Explore how document knowledge can be organized for relevant retrieval.',
      'Connect retrieved context to answer generation grounded in source material.',
      'Evaluate retrieval relevance and answer quality as connected parts of the system.',
    ],
  },
  {
    number: '02',
    title: 'Agentic AI Workflow System',
    description:
      'An agent-oriented AI workflow designed around reasoning, tool usage, structured execution, and automation.',
    focus: ['Agentic AI', 'LLMs', 'Tool Use', 'Workflow Engineering'],
    kind: 'agents',
    status: 'Project direction',
    technicalApproach: [
      'Explore how reasoning can guide a structured sequence of workflow steps.',
      'Connect language model decisions to tool usage and execution.',
      'Consider how each step contributes to a useful, coherent automated workflow.',
    ],
  },
  {
    number: '03',
    title: 'LLM Evaluation & Reliability',
    description:
      'A system for testing groundedness, retrieval relevance, correctness, hallucination behavior, and response quality.',
    focus: ['Evaluation', 'RAG Testing', 'Groundedness', 'Reliability'],
    kind: 'evaluation',
    status: 'Project direction',
    technicalApproach: [
      'Examine whether retrieved context is relevant to the question.',
      'Assess correctness and whether responses are supported by their source material.',
      'Study hallucination behavior and response quality to inform system reliability.',
    ],
  },
]

export const experience: readonly ExperienceEntry[] = [
  {
    company: 'PHOENIX ICT SOLUTIONS',
    primaryRole: 'AI / ML Engineer',
    current: true,
    summary: 'AI engineering across retrieval, language model systems, evaluation, and frontend / product engineering.',
  },
  {
    company: 'ZSCALER',
    primaryRole: 'Associate SDE — Platform Engineering',
    additionalRoles: ['QA Engineer Intern'],
    current: false,
    contributions: [
      'RAG dataset creation and RAG / LLM engineering.',
      'OAuth / RBAC repository visibility and Tree-Sitter multi-language support.',
      'Locust load testing and Jenkins CI/CD.',
    ],
    technologies: ['OAuth', 'RBAC', 'Tree-Sitter', 'Locust', 'Jenkins'],
  },
]

export const capabilities: readonly CapabilityGroup[] = [
  {
    title: 'AI / LLM',
    items: [
      'RAG',
      'LLMs',
      'Prompt Engineering',
      'Agentic AI',
      'LLM Evaluation',
      'Semantic Search',
    ],
  },
  {
    title: 'Languages / Application Engineering',
    items: ['Python', 'TypeScript', 'JavaScript', 'React'],
  },
  {
    title: 'AI / Retrieval Engineering',
    items: [
      'Knowledge Bases',
      'Embeddings',
      'Vector Search',
      'Retrieval Pipelines',
      'Grounded Generation',
    ],
  },
  {
    title: 'Engineering / Tooling',
    items: ['Git', 'GitHub', 'Docker', 'CI/CD', 'Testing', 'API Integration'],
  },
]

export const philosophy: readonly PhilosophyPrinciple[] = [
  { word: 'RETRIEVE', description: 'Find the right context.' },
  { word: 'REASON', description: 'Transform context into useful decisions.' },
  { word: 'ACT', description: 'Connect intelligence to tools and workflows.' },
  { word: 'EVALUATE', description: 'Measure whether the system is actually reliable.' },
]

// Destinations and new-tab behavior are explicit, independent of visible labels.
export const contactLinks: readonly ContactLink[] = [
  { id: 'email', kind: 'email', label: 'Email', href: 'mailto:dwaraknath.balaji@gmail.com', displayValue: 'dwaraknath.balaji@gmail.com', external: false, accessibleLabel: 'Email Dwaraknath Balaji' },
  { id: 'github', kind: 'profile', label: 'GitHub', href: 'https://github.com/Dwaraknath1810', displayValue: 'github.com/Dwaraknath1810', external: true, accessibleLabel: 'Dwaraknath Balaji on GitHub (opens in a new tab)' },
]
