export interface Identity {
  readonly name: string
  readonly role: string
  readonly positioning: string
  readonly supportingLine: string
  readonly location: string
}

export interface NavigationItem {
  readonly id: 'about' | 'expertise' | 'work' | 'experience' | 'capabilities' | 'philosophy' | 'contact'
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
  readonly status: 'Project direction' | 'In progress' | 'Completed'
  readonly projectType: string
  readonly objective?: string
  readonly context?: string
  readonly role?: string
  readonly responsibilities?: readonly string[]
  readonly architecture?: readonly string[]
  readonly technicalApproach: readonly string[]
  readonly engineeringDecisions?: readonly string[]
  readonly constraints?: readonly string[]
  readonly challenges?: readonly string[]
  readonly evaluationMethod?: string
  readonly verifiedOutcomes?: readonly string[]
  readonly stack?: readonly string[]
  readonly media?: readonly { readonly src: string; readonly alt: string; readonly width: number; readonly height: number }[]
  readonly repositoryUrl?: string
  readonly demoUrl?: string
  readonly caseStudyUrl?: string
}

export interface ExperienceEntry {
  readonly company: string
  readonly primaryRole: string
  readonly additionalRoles?: readonly string[]
  readonly startDate?: string
  readonly endDate?: string
  readonly current?: boolean
  readonly previous: boolean
  readonly location?: string
  readonly summary?: string
  readonly responsibilities?: readonly string[]
  readonly engineeringContributions: readonly string[]
  readonly verifiedOutcomes?: readonly string[]
  readonly technologies?: readonly string[]
  readonly companyUrl?: string
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
  readonly id: string
  readonly kind: 'email' | 'github' | 'social'
  readonly label: string
  readonly href: string
  readonly displayValue: string
  readonly external: boolean
  readonly accessibleLabel: string
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
    objective: 'Explore dependable answers over a document knowledge base.',
    architecture: ['Proposed flow: source documents → chunks → embeddings → retrieval → grounded response → evaluation.'],
    engineeringDecisions: ['Compare retrieval quality separately from generation quality so failures can be traced to the right stage.', 'Keep source references alongside retrieved context.'],
    constraints: ['A conceptual direction; no deployment, dataset or measured results have been supplied.'],
    evaluationMethod: 'Proposed: review retrieval relevance and source support for each answer using a curated question set.',
    status: 'Project direction',
    projectType: 'Conceptual system study',
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
    objective: 'Explore a structured path from a user objective to tool-assisted execution.',
    architecture: ['Proposed flow: objective → plan → tool selection → execution → observation → revised plan.'],
    engineeringDecisions: ['Define explicit tool inputs and outputs before connecting them to model decisions.', 'Consider bounded execution and reviewable traces for each workflow step.'],
    constraints: ['A conceptual direction; no implemented tool integrations or business outcomes have been supplied.'],
    evaluationMethod: 'Proposed: inspect task completion, tool selection and failure recovery against predefined workflow examples.',
    status: 'Project direction',
    projectType: 'Conceptual system study',
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
    objective: 'Explore a repeatable way to examine response quality and grounding.',
    architecture: ['Proposed flow: questions + reference evidence → system responses → criterion-level review → failure analysis.'],
    engineeringDecisions: ['Keep correctness, relevance and groundedness distinct rather than hiding them in one score.', 'Retain the source evidence needed to review individual claims.'],
    constraints: ['A conceptual direction; no benchmark scores or measured improvements have been supplied.'],
    evaluationMethod: 'Proposed: compare responses against reference evidence and review disagreements before interpreting aggregate results.',
    status: 'Project direction',
    projectType: 'Conceptual system study',
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
    engineeringContributions: [
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
    primaryRole: 'Associate SDE — Platform Engineering',
    additionalRoles: ['QA Engineer Intern'],
    engineeringContributions: [
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
  { id: 'email', kind: 'email', label: 'Email', href: 'mailto:dwaraknath.balaji@gmail.com', displayValue: 'dwaraknath.balaji@gmail.com', external: false, accessibleLabel: 'Email Dwaraknath Balaji' },
  { id: 'github', kind: 'github', label: 'GitHub', href: 'https://github.com/Dwaraknath1810', displayValue: 'github.com/Dwaraknath1810', external: true, accessibleLabel: 'Dwaraknath Balaji on GitHub (opens in a new tab)' },
]
