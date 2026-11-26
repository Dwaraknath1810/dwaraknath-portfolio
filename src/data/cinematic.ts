/** Portfolio narrative grounded in the current published AI Engineer resume PDF.
 * Public-facing descriptions avoid claims of confidential deliverables or source releases.
 */
export const identity = {
  name: 'Dwaraknath Balaji',
  title: 'AI Engineer',
  summary: 'I build enterprise document intelligence and agentic AI applications with Python, semantic search and evidence-grounded evaluation. At Phoenix ICT Solutions I work on RAG pipelines, ingestion, retrieval and LLM reliability; at Zscaler I worked on repository access controls, code parsing and LLM load testing. My independent full-stack projects, Agent Intelligence and JARVIS, extend that experience into multi-agent research, tool orchestration and human-in-the-loop automation.',
} as const

export const skillGroups = [
  {title:'GENERATIVE & AGENTIC AI', skills:['OpenAI Agents SDK','Multi-agent systems','LangGraph','LangChain','Agent orchestration','Tool calling','Claude','ChatGPT','OpenAI models','Azure OpenAI (GPT-4o)','AWS Bedrock','Ollama','Hugging Face Transformers','Prompt engineering']},
  {title:'RAG & DOCUMENT INTELLIGENCE', skills:['RAG','Embeddings','Semantic search','Document chunking','Qdrant','Elasticsearch','FAISS','Evidence retrieval','Citation grounding']},
  {title:'FULL-STACK AI ENGINEERING', skills:['Python','FastAPI','REST APIs','Pydantic','React','TypeScript','Vite','PostgreSQL','SQLite','WebSockets','Server-Sent Events']},
  {title:'AI EVALUATION & TESTING', skills:['LangSmith','Retrieval precision and recall','Groundedness','Citation accuracy','Hallucination detection','Pytest','Locust','Vitest','Playwright','PyATS','UAT']},
  {title:'CLOUD, SECURITY & DELIVERY', skills:['AWS','Azure','Docker Compose','Docker','Git','GitHub','Jenkins CI/CD','Linux','OAuth 2.0','RBAC']},
  {title:'MACHINE LEARNING', skills:['TensorFlow','Keras','Scikit-learn','OpenCV','Pandas','NumPy']},
  {title:'EXPLORATORY TOOLS', skills:['ChatGPT Work','Claude Cowork','Model Context Protocol (MCP)']},
] as const

export const career = [
  {
    years:[2024],
    period:'MAR – SEP 2024',
    title:'Software Development Intern',
    company:'Zscaler Softech India Pvt Ltd',
    description:'Automated logging and error tracking with Python and Pytest; ran unit, integration and end-to-end tests using PyATS and Docker; contributed to Jenkins CI/CD and used Jira and Bitbucket.',
  },
  {
    years:[2024,2025],
    period:'SEP 2024 – APR 2025',
    title:'Software Development Engineer',
    company:'Zscaler Softech India Pvt Ltd',
    description:'Curated enterprise RAG datasets for embedding and retrieval quality; integrated Tree-sitter source-code parsing; implemented OAuth 2.0 and repository RBAC; load-tested LLM throughput and latency with Locust and automated CI/CD with Jenkins.',
  },
  {
    years:[2025,2026],
    period:'JUL 2025 – PRESENT',
    title:'AI Engineer',
    company:'Phoenix ICT Solutions Pty Ltd',
    description:'Build enterprise RAG pipelines, semantic search with Qdrant and Elasticsearch, and ingestion/chunking across PDF, DOCX and structured data. Develop multi-step workflows with Claude, LangChain and LangGraph. Evaluate factual accuracy, grounding, citations and retrieval across documents, spreadsheets, audio and multilingual content; validate charts, regression, UAT, RBAC and bulk ingestion under load.',
  },
  {
    years:[2024],
    period:'MAY 2024',
    title:'B.Tech — Artificial Intelligence and Data Science',
    company:'Sona College of Technology · Anna University',
    description:'Graduated with a CGPA of 8.65/10.',
  },
] as const

export type ProjectKind = 'personal' | 'professional' | 'ml'
export type PortfolioProject = {
  slug: string
  kind: ProjectKind
  name: string
  subtitle?: string
  category: string
  description: string
  result: string
  stack: readonly string[]
  glyph: string
  art: string
  sourceUrl: string | null
  restrictedSourceUrl?: string
  diagram: string
  screenshot: string | null
  evidenceType: string
  notes: { approach: string; validation: string }
  architecture?: readonly string[]
  decisions?: readonly string[]
  limitations?: string
}
export const featuredProjects: readonly PortfolioProject[] = [
  {
    slug:'agent-intelligence', kind:'personal', art:'research',
    name:'AGENT INTELLIGENCE', subtitle:'Multi-Agent AI Research Platform',
    category:'FLAGSHIP PERSONAL PROJECT · MULTI-AGENT SYSTEMS',
    description:'A full-stack research workspace that coordinates specialised agents and preserves evidence references from research tasks to structured reports.',
    result:'Locally developed · Offline tested · Private repository',
    stack:['Python','OpenAI Agents SDK','Pydantic','FastAPI','React','TypeScript','PostgreSQL','Qdrant','SSE','Docker Compose','Pytest'],
    glyph:'5 AGENTS', sourceUrl:null, restrictedSourceUrl:'https://github.com/Dwaraknath1810/multi-agent-ai', diagram:'/projects/agent-intelligence.svg', screenshot:null,
    evidenceType:'Original architecture illustration based on the resume and reviewed implementation; not an application screenshot.',
    notes:{approach:'A FastAPI backend coordinates five structured-output agent roles. The supervisor delegates bounded parallel research tasks; analysis, verification and writing proceed in sequence. Evidence and execution events are persisted for traceability, with Qdrant retrieval and replayable server-sent events.',validation:'Repository documentation records offline SDK Runner and workflow tests, local fixture-embedding retrieval, and local service checks. Live OpenAI API execution and paid embeddings were not verified.'},
    architecture:['React / TypeScript workspace → FastAPI backend','Supervisor → parallel research tasks (Qdrant document evidence)','Analysis compares evidence; verification checks support and may request bounded corrections','Writer produces the structured report with source references','PostgreSQL persists jobs, evidence and events; SSE replays activity to the interface'],
    decisions:['Structured outputs and stable evidence IDs support inspectability, not guaranteed factual truth.','Parallel research and sequential specialist stages separate independent work from dependent synthesis.','Cancellation and bounded correction help control execution; missing provider credentials produce explicit errors.'],
    limitations:'Runs locally. Live OpenAI API and embedding validation remain pending; cloud deployment is deferred. No public source or live demo.'
  },
  {
    slug:'jarvis',kind:'personal',art:'assistant',
    name:'JARVIS',subtitle:'Personal AI Assistant',
    category:'FLAGSHIP PERSONAL PROJECT · AI AUTOMATION',
    description:'A local-first macOS assistant that coordinates conversational requests, tool calls, persistent memory and controlled desktop actions.',
    result:'Local implementation · Browser and mock-provider tested · Private repository',
    stack:['Python','LangGraph','FastAPI','React','TypeScript','SQLite','Ollama','OpenAI','WebSockets','Playwright'],
    glyph:'JARVIS',sourceUrl:null,restrictedSourceUrl:'https://github.com/Dwaraknath1810/jarvis',diagram:'/projects/jarvis.svg',screenshot:null,
    evidenceType:'Original architecture illustration based on the resume and reviewed implementation; not an application screenshot.',
    notes:{approach:'A rule-based router selects typed tool jobs coordinated by LangGraph. Independent reads can run in parallel; sensitive file and application actions pass a code-enforced, single-use approval gate before execution. SQLite stores conversations, tasks and memory; WebSocket events stream progress and results.',validation:'The resume records Chromium Playwright tests of persistence, approval handling and cancellation, local WebSocket event exercises and mocked provider responses. The repository documents streaming adapters and restricted tool policies; live provider inference is not independently verified.'},
    architecture:['React / TypeScript command centre ↔ FastAPI (HTTP and WebSocket events)','Rule-based routing → LangGraph plan, execution and review','Read-only operations may run concurrently; sensitive actions require explicit single-use approval before execution','Typed workspace and macOS tools return results through the review stage','SQLite stores conversations, tasks and memory; Ollama / OpenAI adapters support streaming'],
    decisions:['Local-first state and scoped tools limit the automation surface.','Code-enforced approval checks separate model intent from permission to act.','Explicit cancellation and streamed execution events make long-running work observable.'],
    limitations:'Local macOS project. Live model behaviour and cloud deployment are not claimed. No public source or live demo.'
  },
  {
    slug:'enterprise-rag',kind:'professional',art:'1',
    name:'ENTERPRISE RAG & DOCUMENT INTELLIGENCE',
    category:'PROFESSIONAL EXPERIENCE · PHOENIX ICT SOLUTIONS',
    description:'Enterprise knowledge systems using document ingestion, embeddings, semantic search, context retrieval, LLM generation and evidence-grounded evaluation.',
    result:'Enterprise AI platform work described in professional experience.',
    stack:['Python','Qdrant','Elasticsearch','RAG','LLM Evaluation'],
    glyph:'RAG',
    sourceUrl:null,
    diagram:'/projects/enterprise-rag-flow.svg',
    screenshot:null,
    evidenceType:'Illustrative workflow; proprietary implementation details omitted',
    notes: { approach:'Document ingestion and chunking; embedding-based retrieval with Qdrant and Elasticsearch; grounded answer generation.', validation:'Evaluated retrieval relevance, response correctness, source grounding and citations across varied document formats.' },
  },
  {
    slug:'agentic-reliability',kind:'professional',art:'2',
    name:'AGENTIC WORKFLOWS & LLM RELIABILITY',
    category:'PROFESSIONAL EXPERIENCE · AI ENGINEERING',
    description:'Multi-step workflows with LangChain, LangGraph and Claude workflows, plus benchmark-led checks for correctness, groundedness and citation accuracy.',
    result:'Focus: dependable, traceable AI behavior.',
    stack:['LangChain','LangGraph','Claude','LangSmith','Pytest'],
    glyph:'AI',
    sourceUrl:null,
    diagram:'/projects/agentic-evaluation-flow.svg',
    screenshot:null,
    evidenceType:'Illustrative workflow; proprietary implementation details omitted',
    notes: { approach:'Orchestrated multi-step reasoning and tool workflows with LangChain, LangGraph and Claude workflows.', validation:'Used benchmark test cases to review hallucinations, factual accuracy, faithfulness and response quality.' },
  },
  {
    slug:'driver-drowsiness',kind:'ml',art:'3',
    name:'DRIVER DROWSINESS DETECTION',
    category:'MACHINE LEARNING PROJECT',
    description:'Real-time closed-eye state classification using convolutional neural networks and OpenCV.',
    result:'92% classification accuracy (resume-reported).',
    stack:['Python','TensorFlow','Keras','OpenCV'],
    glyph:'92%',
    sourceUrl:'https://github.com/Dwaraknath1810/Driver-drowsiness-detection',
    diagram:'/projects/driver-drowsiness-flow.svg',
    screenshot:'/projects/driver-drowsiness-training-accuracy.png',
    evidenceType:'Original training chart from linked public Jupyter notebook',
    notes: { approach:'CNN-based closed-eye classification with image processing in OpenCV.', validation:'92% classification accuracy reported in the resume; evaluation dataset details are not published.' },
  },
  {
    slug:'sentiment-analysis',kind:'ml',art:'4',
    name:'SENTIMENT ANALYSIS SYSTEM',
    category:'MACHINE LEARNING PROJECT',
    description:'Text classification using SVM, logistic regression and Naive Bayes with preprocessing and under-sampling for imbalanced data.',
    result:'88% F1-score (resume-reported).',
    stack:['Python','Scikit-learn','Pandas','SVM'],
    glyph:'88%',
    sourceUrl:'https://github.com/Dwaraknath1810/Sentimental-analysis',
    diagram:'/projects/sentiment-classification-flow.svg',
    screenshot:null,
    evidenceType:'Source notebook linked; no public screenshot available',
    notes: { approach:'Text preprocessing, targeted under-sampling and comparison of SVM, logistic regression and Naive Bayes.', validation:'88% F1-score reported in the resume for the imbalanced classification task.' },
  },
] as const

export const credentials = {
  degree:'B.TECH AI & DATA SCIENCE · CGPA 8.65/10',
  aws:'AWS CERTIFIED DEVELOPER – ASSOCIATE',
  publication:'MRTM 2023 · ENERGY-EFFICIENT IoT RESOURCE ALLOCATION USING DEEP REINFORCEMENT LEARNING',
  hackathon:'SONA COLLEGE HACKATHON · 2ND PLACE',
  microsoft:'MICROSOFT AI AND ML ENGINEERING · COURSERA',
  google:'GOOGLE DATA ANALYTICS · COURSERA',
} as const

export const contactLinks = {
  email:'mailto:dwaraknath.balaji@gmail.com',
  github:'https://github.com/Dwaraknath1810',
} as const

/** "Work" and "Cowork" modes are shown as areas of exploration, rather
 * than falsely claiming undocumented production deployments. */
export const featuredAIWorkspaces = [
  {
    id: 'chatgpt-work',
    glyph: 'GPT',
    name: 'ChatGPT Work',
    provider: 'OPENAI',
    category: 'AGENTIC WORKSPACE · EXPLORATION',
    description: 'Research, planning and multi-step project workflows with AI assistance.',
    useCase: 'Potential use: structure technical research, draft implementation plans and review project artifacts.',
  },
  {
    id: 'claude-cowork',
    glyph: 'C',
    name: 'Claude / Cowork',
    provider: 'ANTHROPIC',
    category: 'AI WORKFLOWS · EXPLORATION',
    description: 'Context-rich analysis and task workflows through Claude’s work capabilities.',
    useCase: 'Potential use: reason through specifications, organize documents and coordinate multi-step work.',
  },
] as const

/** Tools and engineering systems explicitly mentioned in the supplied resume. */
export const engineeringTools = [
  { short:'OA', name:'OpenAI Agents SDK', category:'Structured agent roles' },
  { short:'LG', name:'LangGraph', category:'Agent orchestration' },
  { short:'LC', name:'LangChain', category:'LLM application flows' },
  { short:'LS', name:'LangSmith', category:'LLM observability' },
  { short:'QD', name:'Qdrant', category:'Vector retrieval' },
  { short:'AZ', name:'Azure OpenAI', category:'Model platform' },
  { short:'BR', name:'AWS Bedrock', category:'Model platform' },
  { short:'PY', name:'Python / FastAPI', category:'Backend systems' },
  { short:'DK', name:'Docker', category:'Environments' },
  { short:'RE', name:'React / TypeScript', category:'Full-stack AI interface' },
  { short:'DB', name:'PostgreSQL / SQLite', category:'Persistence' },
  { short:'PD', name:'Pydantic', category:'Typed contracts' },
  { short:'PW', name:'Playwright', category:'Browser testing' },
] as const

export const engineeringPipeline = [
  { number:'01', name:'INGEST', text:'Process documents and structured inputs; prepare them for retrieval.' },
  { number:'02', name:'RETRIEVE', text:'Use embeddings, vector search and context ranking to identify relevant evidence.' },
  { number:'03', name:'REASON', text:'Supply retrieved context to language models and structured agent workflows.' },
  { number:'04', name:'EVALUATE', text:'Check groundedness, citation accuracy, hallucinations and response reliability.' },
] as const

export const evidenceHighlights = [
  { value:'92%', label:'Closed-eye classification accuracy', note:'Driver drowsiness project' },
  { value:'88%', label:'F1-score on imbalanced text data', note:'Sentiment analysis project' },
  { value:'8.65', label:'CGPA out of 10', note:'B.Tech AI & Data Science' },
] as const
