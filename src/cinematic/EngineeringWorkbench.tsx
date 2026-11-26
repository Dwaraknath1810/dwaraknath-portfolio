import { m, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, CircuitBoard, FlaskConical, Layers3 } from 'lucide-react'
import { engineeringPipeline, engineeringTools, evidenceHighlights, featuredAIWorkspaces } from '../data/cinematic'
import './EngineeringWorkbench.css'

export function EngineeringWorkbench() {
  const reduced=useReducedMotion()
  return (
    <section className="film-scene film-workbench" id="workbench" aria-labelledby="workbench-title">
      <div className="film-workbench-stars" aria-hidden="true"/>
      <div className="film-scene-content film-workbench-content">
        <p className="film-kicker">THE WORKBENCH / AI TOOLS & ENGINEERING</p>
        <div className="film-workbench-heading">
          <h2 id="workbench-title">TOOLS ARE ONLY<br/><em>THE BEGINNING.</em></h2>
          <p>How I approach problems matters more than a list of logos. I combine engineering tools with retrieval design, structured reasoning, and evidence-led evaluation.</p>
        </div>
        <div className="film-workbench-featured" aria-label="AI workspace capabilities">
          {featuredAIWorkspaces.map((tool,i)=>
            <m.article
              className={`film-workbench-feature film-workbench-feature-${i+1}`}
              key={tool.id}
              initial={reduced?false:{opacity:0,y:24}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true,amount:.25}}
              transition={{duration:reduced?0:.65,delay:i*.12}}
            >
              <div className="film-workbench-feature-top">
                <div className="film-workbench-brand" aria-hidden="true">{tool.id==='chatgpt-work'?<img className="film-workbench-openai-logo" src="/openai-blossom.svg" width="36" height="36" alt="" />:<span className="film-workbench-claude-icon">✳</span>}</div>
                <span>{tool.provider} <ArrowUpRight size={14} aria-hidden="true"/></span>
              </div>
              <h3>{tool.name}</h3>
              <p className="film-workbench-category">{tool.category}</p>
              <p className="film-workbench-description">{tool.description}</p>
              <div className="film-workbench-usecase"><span>WORKFLOW IDEA</span><p>{tool.useCase}</p></div>
            </m.article>
          )}
        </div>
        <p className="film-workbench-disclosure">The two workspace cards describe tools I am exploring—not verified work deployments. The engineering technologies below reflect my professional experience and personal projects.</p>
        <div className="film-workbench-toolhead">
          <div><Layers3 size={19} aria-hidden="true"/><h3>ENGINEERING TOOLCHAIN</h3></div>
          <p>Applied technologies from enterprise and personal AI engineering</p>
        </div>
        <div className="film-workbench-tools">
          {engineeringTools.map((tool,i)=><m.div
            className="film-workbench-tool" key={tool.name}
            initial={reduced?false:{opacity:0,y:12}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true,amount:.25}}
            transition={{duration:reduced?0:.42,delay:(i%4)*.07}}
          >
            <span className="film-workbench-tool-symbol" aria-hidden="true">{tool.short}</span>
            <span className="film-workbench-tool-copy"><strong>{tool.name}</strong><small>{tool.category}</small></span>
          </m.div>)}
        </div>
        <div className="film-workbench-process">
          <div className="film-workbench-process-intro">
            <div className="film-workbench-process-label"><CircuitBoard size={20} aria-hidden="true"/> FROM CONCEPT TO RELIABLE ANSWERS</div>
            <h3>HOW I BUILD<br/><em>AI SYSTEMS.</em></h3>
            <p>A practical RAG development model, reflecting the ingestion, retrieval, agentic workflows and evaluation documented in my resume.</p>
          </div>
          <ol className="film-workbench-pipeline">
            {engineeringPipeline.map((step,i)=><li key={step.number}>
              <span className="film-workbench-pipeline-index">{step.number}</span>
              <div><h4>{step.name}</h4><p>{step.text}</p></div>
              <span className="film-workbench-pipeline-arrow" aria-hidden="true">{i===engineeringPipeline.length-1?<CheckCircle2 size={18}/>:<ArrowUpRight size={18}/>}</span>
            </li>)}
          </ol>
        </div>
        <div className="film-workbench-evidence">
          <div className="film-workbench-evidence-head"><FlaskConical size={21}/><div><h3>THE PROOF BEHIND THE WORK</h3><p>Reported project outcomes and academic performance</p></div></div>
          <div className="film-workbench-metrics">
            {evidenceHighlights.map(item=><div className="film-workbench-metric" key={item.label}>
              <strong>{item.value}</strong><span>{item.label}</span><small>{item.note}</small>
            </div>)}
          </div>
          <p className="film-workbench-evidence-note">The two ML metrics are sourced from my resume. They represent project-specific results, not production performance or external benchmarks.</p>
        </div>
      </div>
    </section>
  )
}
