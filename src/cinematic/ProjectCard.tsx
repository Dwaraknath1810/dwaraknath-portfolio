import { type PointerEvent } from 'react'
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { type PortfolioProject as Project } from '../data/cinematic'

/**
 * The card remains useful without animations. Desktop pointer movement adds a
 * subtle sense of depth; the actual project information is semantic HTML.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion()
  const tiltXTarget = useMotionValue(0)
  const tiltYTarget = useMotionValue(0)
  const lightX = useMotionValue(50)
  const lightY = useMotionValue(42)
  const rotateX = useSpring(tiltXTarget, { stiffness: 120, damping: 24 })
  const rotateY = useSpring(tiltYTarget, { stiffness: 120, damping: 24 })
  const spotlight = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(188, 208, 255, .22), transparent 52%)`

  function move(event: PointerEvent<HTMLElement>) {
    if (reduce || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / rect.width
    const ny = (event.clientY - rect.top) / rect.height
    tiltXTarget.set((0.5 - ny) * 7)
    tiltYTarget.set((nx - 0.5) * 7)
    lightX.set(nx * 100)
    lightY.set(ny * 100)
  }

  function reset() {
    tiltXTarget.set(0)
    tiltYTarget.set(0)
    lightX.set(50)
    lightY.set(42)
  }

  return (
    <m.article
      id={`project-${project.slug}`}
      className={`film-project-card film-project-card--interactive${project.kind === 'personal' ? ' film-project-card--flagship' : ''}`}
      onPointerMove={move}
      onPointerLeave={reset}
      initial={reduce ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      aria-labelledby={`film-project-title-${index + 1}`}
    >
      <m.div className="film-project-glare" style={reduce ? undefined : { background: spotlight }} aria-hidden="true" />
      <div className={`film-project-art film-project-art-${project.art}`} aria-hidden="true">
        <div className="film-project-orb film-project-orb--outer" />
        <div className="film-project-orb film-project-orb--inner" />
        <div className="film-project-glyph">{project.glyph}</div>
        <span>CASE / {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="film-project-information">
        <span>{project.category}</span>
        <h3 id={`film-project-title-${index+1}`}>{project.name}</h3>
        {project.subtitle && <p className="film-project-subtitle">{project.subtitle}</p>}
        <p>{project.description}</p>
        <p className="film-project-result">{project.result}</p>
        <div className="film-project-tags" aria-label="Project technologies">
          {project.stack.map(technology => <span key={technology}>{technology}</span>)}
        </div>
        {project.sourceUrl && <a className="film-project-source" href={project.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View the public GitHub repository for ${project.name}`}>VIEW VERIFIED GITHUB CODE <span aria-hidden="true">↗</span></a>}
        {project.kind === 'personal' && <p className="film-project-private">PRIVATE SOURCE · CASE STUDY AVAILABLE</p>}
        <details className="film-project-details">
          <summary>Explore architecture & evidence <span aria-hidden="true">+</span></summary>
          <div className="film-project-detail-content">
            <figure className="film-project-diagram">
              <img src={project.diagram} alt={`Architecture diagram for ${project.name}; workflow described below`} loading="lazy" decoding="async" width={project.kind === 'personal' ? 760 : 960} height={project.kind === 'personal' ? 440 : 330}/>
              <figcaption>{project.evidenceType}</figcaption>
            </figure>
            <div><h4>HOW IT WORKS</h4><p>{project.notes.approach}</p></div>
            {project.architecture && <div><h4>ARCHITECTURE & WORKFLOW</h4><ol className="film-case-list">{project.architecture.map(step => <li key={step}>{step}</li>)}</ol></div>}
            {project.decisions && <div><h4>ENGINEERING DECISIONS</h4><ul className="film-case-list">{project.decisions.map(decision => <li key={decision}>{decision}</li>)}</ul></div>}
            <div><h4>TESTING & EVIDENCE</h4><p>{project.notes.validation}</p></div>
            {project.screenshot && <div className="film-project-plot-pair">
              <figure className="film-project-evidence-image">
                <img src={project.screenshot} alt="Training accuracy versus validation accuracy chart from the public driver drowsiness notebook" loading="lazy" decoding="async"/>
                <figcaption>Actual model training accuracy plot from the public notebook</figcaption>
              </figure>
              <figure className="film-project-evidence-image">
                <img src="/projects/driver-drowsiness-training-loss.png" alt="Training loss versus validation loss chart from the public driver drowsiness notebook" loading="lazy" decoding="async"/>
                <figcaption>Actual training loss plot from the same notebook</figcaption>
              </figure>
              <p className="film-project-evidence-source">These notebook plots are not independent verification of the resume-reported 92% classification accuracy.</p>
            </div>}
            {project.limitations && <div><h4>IMPLEMENTATION STATUS & LIMITATIONS</h4><p>{project.limitations}</p></div>}
            {project.sourceUrl ? <p className="film-project-evidence-source">Source code and notebook are available at the linked public GitHub repository.</p> : project.kind === 'professional' ? <p className="film-project-evidence-source">Professional experience summary only; confidential implementation details and screenshots are not public.</p> : null}
          </div>
        </details>
      </div>
    </m.article>
  )
}
