export interface Identity {
  readonly name: string
  readonly role: string
  readonly positioning: string
  readonly supportingLine: string
  readonly location: string
}

export interface NavigationItem {
  readonly id: 'about' | 'expertise' | 'work' | 'experience' | 'philosophy' | 'contact'
  readonly label: string
}

export interface ExpertiseArea {
  readonly number: string
  readonly title: string
  readonly description: string
}

export type ProjectKind = 'retrieval' | 'agents' | 'evaluation'

export interface Project {
  readonly number: string
  readonly title: string
  readonly description: string
  readonly focus: readonly string[]
  readonly kind: ProjectKind
  readonly status: 'Project direction'
  readonly detail: {
    readonly approach: readonly string[]
  }
}

export interface ExperienceEntry {
  readonly company: string
  readonly roles: readonly string[]
  readonly focus: readonly string[]
  readonly previous: boolean
}

export interface CapabilityGroup {
  readonly title: string
  readonly items: readonly string[]
}

export interface PhilosophyPrinciple {
  readonly word: string
  readonly description: string
}

export interface ContactLink {
  readonly label: 'Email' | 'GitHub'
  readonly value: string
}

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
    detail: {
      approach: [
        'Explore how document knowledge can be organized for relevant retrieval.',
        'Connect retrieved context to answer generation grounded in source material.',
        'Evaluate retrieval relevance and answer quality as connected parts of the system.',
      ],
    },
  },
  {
    number: '02',
    title: 'Agentic AI Workflow System',
    description:
      'An agent-oriented AI workflow designed around reasoning, tool usage, structured execution, and automation.',
    focus: ['Agentic AI', 'LLMs', 'Tool Use', 'Workflow Engineering'],
    kind: 'agents',
    status: 'Project direction',
    detail: {
      approach: [
        'Explore how reasoning can guide a structured sequence of workflow steps.',
        'Connect language model decisions to tool usage and execution.',
        'Consider how each step contributes to a useful, coherent automated workflow.',
      ],
    },
  },
  {
    number: '03',
    title: 'LLM Evaluation & Reliability',
    description:
      'A system for testing groundedness, retrieval relevance, correctness, hallucination behavior, and response quality.',
    focus: ['Evaluation', 'RAG Testing', 'Groundedness', 'Reliability'],
    kind: 'evaluation',
    status: 'Project direction',
    detail: {
      approach: [
        'Examine whether retrieved context is relevant to the question.',
        'Assess correctness and whether responses are supported by their source material.',
        'Study hallucination behavior and response quality to inform system reliability.',
      ],
    },
  },
]

export const experience: readonly ExperienceEntry[] = [
  {
    company: 'PHOENIX ICT SOLUTIONS',
    roles: ['AI / ML Engineer'],
    focus: [
      'AI engineering',
      'RAG',
      'LLM systems',
      'Evaluation',
      'Frontend / product engineering',
    ],
    previous: false,
  },
  {
    company: 'ZSCALER',
    roles: ['QA Engineer Intern', 'Associate SDE — Platform Engineering'],
    focus: [
      'RAG dataset creation',
      'OAuth / RBAC repository visibility',
      'Tree-Sitter multi-language support',
      'RAG / LLM engineering',
      'Locust load testing',
      'Jenkins CI/CD',
    ],
    previous: true,
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

// Contact values are kept here so the displayed details and links stay in sync.
export const contactLinks: readonly ContactLink[] = [
  { label: 'Email', value: 'dwaraknath.balaji@gmail.com' },
  { label: 'GitHub', value: 'https://github.com/Dwaraknath1810' },
]
