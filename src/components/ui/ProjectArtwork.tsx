import { BrainCircuit, Braces, Database, Layers3, MoveUpRight, Wrench } from 'lucide-react'
import '../../styles/artwork.css'

type ArtworkKind = 'retrieval' | 'agents' | 'evaluation'

const evaluationSignals = [
  { label: 'Groundedness', bars: [16, 22, 18, 34, 47, 40, 62, 77, 65, 82, 69, 53] },
  { label: 'Relevance', bars: [34, 27, 42, 58, 50, 69, 84, 72, 59, 65, 43, 31] },
  { label: 'Correctness', bars: [22, 35, 47, 39, 64, 76, 88, 71, 81, 62, 44, 35] },
  { label: 'Consistency', bars: [37, 43, 52, 67, 61, 75, 69, 80, 63, 56, 42, 30] },
]

function RetrievalArtwork() {
  return (
    <>
      <div className="art-retrieval-lines">
        <i />
        <i />
        <i />
      </div>
      <div className="art-documents">
        {[0, 1, 2].map((document) => (
          <div className={`art-document art-document-${document}`} key={document}>
            <span className="art-document-index">KB / 00{document + 1}</span>
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
        <div className="art-semantic-core"><Layers3 strokeWidth={1} /></div>
        <span className="art-core-caption">SEMANTIC INDEX</span>
      </div>
      <span className="art-source-caption">SOURCE DOCUMENTS</span>
      <div className="art-answer">
        <i />
        <span>GROUNDED<br />CONTEXT</span>
      </div>
    </>
  )
}

function AgentArtwork() {
  return (
    <>
      <div className="art-agent-guide art-agent-guide-horizontal" />
      <div className="art-agent-guide art-agent-guide-vertical" />
      <div className="art-connection art-connection-context" />
      <div className="art-connection art-connection-plan" />
      <div className="art-connection art-connection-tools" />
      <div className="art-connection art-connection-act" />
      <div className="art-node art-node-context">
        <Database strokeWidth={1.2} />
        <span>CONTEXT</span>
        <i className="art-node-port" />
      </div>
      <div className="art-node art-node-plan">
        <Braces strokeWidth={1.2} />
        <span>PLAN</span>
        <i className="art-node-port" />
      </div>
      <div className="art-node art-node-center">
        <BrainCircuit strokeWidth={1} />
        <span>REASON</span>
        <small>ORCHESTRATION</small>
      </div>
      <div className="art-node art-node-tools">
        <Wrench strokeWidth={1.2} />
        <span>TOOLS</span>
        <i className="art-node-port" />
      </div>
      <div className="art-node art-node-act">
        <MoveUpRight strokeWidth={1.2} />
        <span>ACT</span>
        <i className="art-node-port" />
      </div>
      <span className="art-agent-note">CONTEXT → DECISION → EXECUTION</span>
    </>
  )
}

function EvaluationArtwork() {
  return (
    <>
      <div className="art-evaluation-grid">
        <span /><span /><span /><span />
      </div>
      <div className="art-evaluation-signals">
        {evaluationSignals.map(({ label, bars }, index) => (
          <div className="art-evaluation-signal" key={label}>
            <div className="art-evaluation-label"><span>0{index + 1}</span>{label}</div>
            <div className="art-signal-bars">
              {bars.map((height, barIndex) => (
                <i key={barIndex} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="art-signal-baseline"><i />RESPONSE QUALITY</div>
          </div>
        ))}
      </div>
      <div className="art-evaluation-caption">
        <span>OBSERVE</span><i /><span>TEST</span><i /><span>REFINE</span>
      </div>
    </>
  )
}

const artworkLabels: Record<ArtworkKind, string> = {
  retrieval: 'KNOWLEDGE ARCHITECTURE',
  agents: 'AGENT ORCHESTRATION',
  evaluation: 'RELIABILITY FRAMEWORK',
}

export function ProjectArtwork({ kind }: { kind: ArtworkKind }) {
  return (
    <div className={`art-stage art-stage-${kind}`} aria-hidden="true">
      <div className="art-stage-heading">
        <span><i />{artworkLabels[kind]}</span>
        <span>SYSTEM / {kind === 'retrieval' ? '01' : kind === 'agents' ? '02' : '03'}</span>
      </div>
      {kind === 'retrieval' && <RetrievalArtwork />}
      {kind === 'agents' && <AgentArtwork />}
      {kind === 'evaluation' && <EvaluationArtwork />}
      <div className="art-stage-footer"><span>DB — INTELLIGENT SYSTEMS</span><span>CONCEPT STUDY</span></div>
    </div>
  )
}

export default ProjectArtwork
