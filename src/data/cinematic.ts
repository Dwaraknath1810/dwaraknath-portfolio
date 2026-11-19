/** Portfolio narrative grounded in Dwaraknath_Balaji_AI_Engineer_Resume(3).pdf.
 * Public-facing descriptions avoid claims of confidential deliverables or source releases.
 */
export const identity = {
  name: 'Dwaraknath Balaji',
  title: 'AI Software Engineer',
  summary: 'I design and evaluate enterprise RAG and LLM applications—from semantic retrieval and knowledge-base ingestion to agentic workflows, grounded responses and reliable AI evaluation.',
} as const

export const skillGroups = [
  {title:'GENERATIVE INTELLIGENCE', skills:['RAG','LLMs','Agentic AI','LangChain','LangGraph','LangSmith','Claude workflows','Claude','ChatGPT','AWS Bedrock','Azure OpenAI GPT-4o','MCP']},
  {title:'RETRIEVAL & DATA', skills:['Qdrant','FAISS','Elasticsearch','PostgreSQL','Knowledge-base ingestion','Document processing','Semantic Search','Pandas','NumPy']},
  {title:'ENGINEERING & CLOUD', skills:['Python','FastAPI','REST APIs','OAuth 2.0','RBAC','AWS','Azure','Docker','Jenkins CI/CD','Git','GitHub']},
  {title:'EVALUATION & ML', skills:['RAG benchmarking','Groundedness','Hallucination testing','Citation accuracy','Pytest','Locust','TensorFlow','Keras','Scikit-learn','OpenCV']},
] as const

export const career = [
  {
    years:[2024],
    period:'MAR – SEP 2024',
    title:'Software Development Intern',
    company:'Zscaler Softech India Pvt Ltd',
    description:'Python test automation, error tracking, Pytest, PyATS, Docker and CI/CD contributions.',
  },
  {
    years:[2024,2025],
    period:'SEP 2024 – APR 2025',
    title:'Software Development Engineer',
    company:'Zscaler Softech India Pvt Ltd',
    description:'RAG datasets and retrieval quality, OAuth 2.0 / RBAC access controls, Tree-sitter parsing, Locust performance testing and Jenkins pipelines.',
  },
  {
    years:[2025,2026],
    period:'JUL 2025 – PRESENT',
    title:'AI Software Engineer',
    company:'Phoenix ICT Solutions Pty Ltd',
    description:'Enterprise RAG pipelines for AI document intelligence, semantic search with Qdrant and Elasticsearch, ingestion across multiple formats, agentic AI workflows, LLM evaluation and UAT.',
  },
  {
    years:[2024],
    period:'MAY 2024',
    title:'B.Tech — Artificial Intelligence and Data Science',
    company:'Sona College of Technology · Anna University',
    description:'Graduated with a CGPA of 8.65/10.',
  },
] as const

export const featuredProjects = [
  {
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
  { short:'LG', name:'LangGraph', category:'Agent orchestration' },
  { short:'LC', name:'LangChain', category:'LLM application flows' },
  { short:'LS', name:'LangSmith', category:'LLM observability' },
  { short:'QD', name:'Qdrant', category:'Vector retrieval' },
  { short:'AZ', name:'Azure OpenAI', category:'Model platform' },
  { short:'BR', name:'AWS Bedrock', category:'Model platform' },
  { short:'PY', name:'Python / FastAPI', category:'Backend systems' },
  { short:'DK', name:'Docker', category:'Environments' },
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
