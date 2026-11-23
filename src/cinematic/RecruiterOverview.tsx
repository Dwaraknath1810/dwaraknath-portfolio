import { ArrowDown, ArrowUpRight, BriefcaseBusiness, Code2, FileText, Mail, ShieldCheck } from 'lucide-react'
import { m, useReducedMotion } from 'framer-motion'
import { career, contactLinks, featuredProjects, identity } from '../data/cinematic'
import './RecruiterOverview.css'

const resumePath = '/Dwaraknath_Balaji_AI_Engineer_Resume.pdf'
const publicProjects = featuredProjects.filter(project => project.sourceUrl !== null)
const professionalRoles = career.filter(entry => entry.title !== 'B.Tech — Artificial Intelligence and Data Science').slice().reverse()

/**
 * One-screen-oriented summary for visitors who want evidence before animation.
 * Every role, project and external link comes from the published resume or
 * publicly verified repositories. This is not a sixth cinematic chapter.
 */
export function RecruiterOverview() {
  const reduced = useReducedMotion()

  return (
    <section className="film-scene film-brief" id="snapshot" aria-labelledby="film-brief-title">
      <div className="film-brief-grid" aria-hidden="true" />
      <div className="film-scene-content film-brief-content">
        <m.div
          className="film-brief-lead"
          initial={reduced ? false : { opacity: 0, y: 27 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .2 }}
          transition={{ duration: reduced ? 0 : .7 }}
        >
          <p className="film-kicker">RECRUITER FAST TRACK / THE QUICK BRIEF</p>
          <div className="film-brief-headline">
            <h2 id="film-brief-title">THE WORK.<br/><em>IN FOCUS.</em></h2>
            <p>{identity.summary} Prefer the details? The resume, work history, and public project notebooks are available right here.</p>
          </div>
        </m.div>

        <div className="film-brief-feature-grid">
          <article className="film-brief-panel film-brief-career">
            <div className="film-brief-panel-title"><BriefcaseBusiness size={18} aria-hidden="true" /><h3>CAREER AT A GLANCE</h3></div>
            <ol className="film-brief-roles">
              {professionalRoles.map(role => (
                <li key={role.title}>
                  <span>{role.period}</span>
                  <h4>{role.title}</h4>
                  <p>{role.company}</p>
                </li>
              ))}
            </ol>
          </article>

          <article className="film-brief-panel film-brief-capabilities">
            <div className="film-brief-panel-title"><Code2 size={18} aria-hidden="true" /><h3>ENGINEERING FOCUS</h3></div>
            <div className="film-brief-focus-items">
              <div><strong>Enterprise RAG</strong><span>Document ingestion, vector retrieval, grounded answers</span></div>
              <div><strong>Agentic AI</strong><span>LangChain, LangGraph, multi-step workflows</span></div>
              <div><strong>LLM evaluation</strong><span>Correctness, source grounding, hallucination and citations</span></div>
              <div><strong>Backend & cloud</strong><span>Python, FastAPI, AWS, Azure and Docker</span></div>
              <div><strong>Applied AI delivery</strong><span>Backend integration, access controls, UAT, load testing and resolving retrieval issues</span></div>
            </div>
          </article>
        </div>

        <div className="film-brief-public">
          <div className="film-brief-public-head">
            <div><ShieldCheck size={18} aria-hidden="true"/><h3>PUBLIC WORK YOU CAN VERIFY</h3></div>
            <p>Direct links to my public repositories, not proprietary enterprise code.</p>
          </div>
          <div className="film-brief-proof-grid">
            {publicProjects.map(project => (
              <article className="film-brief-proof" key={project.name}>
                <span className="film-brief-proof-index">PUBLIC GITHUB PROJECT</span>
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                <strong>{project.result}</strong>
                {project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                  INSPECT SOURCE <ArrowUpRight size={16} aria-hidden="true"/>
                </a>}
              </article>
            ))}
          </div>
          <p className="film-brief-evidence-note">Project metrics are reported in my resume, not independently audited. Enterprise project workflows are conceptual illustrations and do not expose confidential material.</p>
        </div>

        <div className="film-brief-actions">
          <a href={resumePath} download="Dwaraknath_Balaji_AI_Engineer_Resume.pdf">
            <FileText size={17} aria-hidden="true"/> DOWNLOAD FULL RESUME <ArrowDown size={16} aria-hidden="true"/>
          </a>
          <a href="#projects">EXPLORE CASE STUDIES <ArrowUpRight size={16} aria-hidden="true"/></a>
          <a href={contactLinks.email}><Mail size={17} aria-hidden="true"/> GET IN TOUCH <ArrowUpRight size={16} aria-hidden="true"/></a>
        </div>
      </div>
    </section>
  )
}
