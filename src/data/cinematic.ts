/** Portfolio narrative grounded in Dwaraknath_Balaji_AI_Engineer_Resume(2).pdf.
 * Public-facing descriptions avoid claims of confidential deliverables or source releases.
 */
export const identity = {
  name: 'Dwaraknath Balaji',
  title: 'AI Software Engineer',
  summary: 'I design and evaluate enterprise RAG and LLM applications—from semantic retrieval and knowledge-base ingestion to agentic workflows, grounded responses and reliable AI evaluation.',
} as const

export const skillGroups = [
  {title:'GENERATIVE INTELLIGENCE', skills:['RAG','LLMs','Agentic AI','LangChain','LangGraph','LangSmith','Claude workflows','AWS Bedrock','Azure OpenAI GPT-4o','MCP']},
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
    description:'Enterprise ZaraLM RAG pipelines, semantic search with Qdrant and Elasticsearch, ingestion across multiple formats, agentic AI workflows, LLM evaluation and UAT.',
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
    result:'ZaraLM work described in professional experience.',
    stack:['Python','Qdrant','Elasticsearch','RAG','LLM Evaluation'],
    glyph:'RAG',
  },
  {
    name:'AGENTIC WORKFLOWS & LLM RELIABILITY',
    category:'PROFESSIONAL EXPERIENCE · AI ENGINEERING',
    description:'Multi-step workflows with LangChain, LangGraph and Claude workflows, plus benchmark-led checks for correctness, groundedness and citation accuracy.',
    result:'Focus: dependable, traceable AI behavior.',
    stack:['LangChain','LangGraph','Claude','LangSmith','Pytest'],
    glyph:'AI',
  },
  {
    name:'DRIVER DROWSINESS DETECTION',
    category:'MACHINE LEARNING PROJECT',
    description:'Real-time closed-eye state classification using convolutional neural networks and OpenCV.',
    result:'92% classification accuracy (resume-reported).',
    stack:['Python','TensorFlow','Keras','OpenCV'],
    glyph:'92%',
  },
  {
    name:'SENTIMENT ANALYSIS SYSTEM',
    category:'MACHINE LEARNING PROJECT',
    description:'Text classification using SVM, logistic regression and Naive Bayes with preprocessing and under-sampling for imbalanced data.',
    result:'88% F1-score (resume-reported).',
    stack:['Python','Scikit-learn','Pandas','SVM'],
    glyph:'88%',
  },
] as const

export const credentials = {
  degree:'B.TECH AI & DATA SCIENCE · CGPA 8.65/10',
  aws:'AWS CERTIFIED DEVELOPER – ASSOCIATE',
  publication:'MRTM 2023 · DEEP REINFORCEMENT LEARNING PAPER',
  hackathon:'SONA COLLEGE HACKATHON · 2ND PLACE',
} as const

export const contactLinks = {
  email:'mailto:dwaraknath.balaji@gmail.com',
  github:'https://github.com/Dwaraknath1810',
} as const
