import '../../styles/artwork.css'

type ArtworkKind = 'retrieval' | 'agents' | 'evaluation'

const evaluationCriteria = ['Groundedness', 'Relevance', 'Correctness', 'Consistency']
const executionSteps = [
  { label: 'Context', detail: 'Objective + constraints' },
  { label: 'Reason', detail: 'A structured plan' },
  { label: 'Tools', detail: 'Selection + execution' },
  { label: 'Act', detail: 'A considered result' },
]

function RetrievalArtwork() {
  return (
    <>
      <div className="art-retrieval-lines"><i /><i /><i /></div>
      <div className="art-documents">
        {[0, 1, 2].map((document) => (
          <div className={`art-document art-document-${document}`} key={document}>
            <span className="art-document-index">SOURCE / {String.fromCharCode(65 + document)}</span>
            <span className="art-document-title" />
            <span className="art-document-line" />
            <span className="art-document-line" />
            <span className="art-document-line art-document-line-short" />
            <span className="art-document-block" />
            <span className="art-document-line" />
            <span className="art-document-line art-document-line-short" />
          </div>
        ))}
      </div>
      <div className="art-orbital-system">
        <div className="art-orbit art-orbit-outer" />
        <div className="art-orbit art-orbit-middle" />
        <div className="art-orbit art-orbit-inner" />
        <div className="art-orbit-axis" />
        <div className="art-semantic-core"><i /><i /><i /></div>
        <span className="art-core-caption">SEMANTIC INDEX</span>
      </div>
      <span className="art-source-caption">SOURCE DOCUMENTS</span>
      <div className="art-answer"><i /><span>GROUNDED<br />CONTEXT</span></div>
    </>
  )
}

function AgentArtwork() {
  return (
    <>
      <div className="art-manuscript-shadow" />
      <div className="art-manuscript">
        <div className="art-manuscript-heading"><span>EXECUTION LOGIC</span><i /></div>
        <div className="art-manuscript-title">From intent to action.</div>
        <div className="art-execution-steps">
          {executionSteps.map(({ label, detail }) => (
            <div className="art-execution-step" key={label}>
              <i /><span>{label}</span><small>{detail}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="art-tool-branch"><i /><i /></div>
      <div className="art-tool-slip art-tool-slip-call">
        <span>TOOL INVOCATION</span><div><i />Input → function</div>
      </div>
      <div className="art-tool-slip art-tool-slip-return">
        <span>RETURN TO CONTEXT</span><div><i />Observe → continue</div>
      </div>
      <span className="art-execution-annotation">A deliberate sequence.<br />A feedback loop.</span>
    </>
  )
}

function EvaluationArtwork() {
  return (
    <>
      <div className="art-proof-sheet art-proof-source">
        <span className="art-proof-label">SOURCE EVIDENCE</span>
        <span className="art-proof-title">Reference context</span>
        <div className="art-proof-copy"><i /><i /><i className="art-proof-highlight" /><i /><i /></div>
        <span className="art-proof-reference">[a] DOCUMENT EXCERPT</span>
      </div>
      <div className="art-proof-sheet art-proof-response">
        <span className="art-proof-label">GENERATED RESPONSE</span>
        <span className="art-proof-title">Claims, with context.</span>
        <div className="art-proof-copy"><i /><i /><i className="art-proof-highlight" /><i /><i /></div>
        <span className="art-proof-reference">[a] TRACE TO SOURCE</span>
        <div className="art-proof-margin"><i /><span>inspect<br />the claim</span></div>
      </div>
      <div className="art-proof-link"><i /><span>Ground the response.</span></div>
      <div className="art-evaluation-criteria">
        {evaluationCriteria.map((criterion) => <span key={criterion}><i />{criterion}</span>)}
      </div>
    </>
  )
}

const artworkLabels: Record<ArtworkKind, string> = {
  retrieval: 'KNOWLEDGE ARCHITECTURE',
  agents: 'AGENT ORCHESTRATION',
  evaluation: 'RELIABILITY FRAMEWORK',
}

const artworkCaptions: Record<ArtworkKind, string> = {
  retrieval: 'DOCUMENTS → EMBEDDINGS → CONTEXT',
  agents: 'REASONING / TOOL USE / FEEDBACK',
  evaluation: 'EVIDENCE ↔ RESPONSE',
}

export function ProjectArtwork({ kind }: { kind: ArtworkKind }) {
  return (
    <div className={`art-stage art-stage-${kind}`} aria-hidden="true">
      <div className="art-stage-heading"><span>{artworkLabels[kind]}</span><i /></div>
      {kind === 'retrieval' && <RetrievalArtwork />}
      {kind === 'agents' && <AgentArtwork />}
      {kind === 'evaluation' && <EvaluationArtwork />}
      <div className="art-stage-footer"><span>{artworkCaptions[kind]}</span></div>
    </div>
  )
}

export default ProjectArtwork
