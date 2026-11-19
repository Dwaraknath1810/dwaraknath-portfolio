import { type PointerEvent } from 'react'
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { featuredProjects } from '../data/cinematic'

type Project = (typeof featuredProjects)[number]

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
      className="film-project-card film-project-card--interactive"
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
      <div className={`film-project-art film-project-art-${index+1}`} aria-hidden="true">
        <div className="film-project-orb film-project-orb--outer" />
        <div className="film-project-orb film-project-orb--inner" />
        <div className="film-project-glyph">{project.glyph}</div>
        <span>CASE / {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="film-project-information">
        <span>{project.category}</span>
        <h3 id={`film-project-title-${index+1}`}>{project.name}</h3>
        <p>{project.description}</p>
        <p className="film-project-result">{project.result}</p>
        <div className="film-project-tags" aria-label="Project technologies">
          {project.stack.map(technology => <span key={technology}>{technology}</span>)}
        </div>
        {project.sourceUrl && <a className="film-project-source" href={project.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View the public GitHub repository for ${project.name}`}>VIEW VERIFIED GITHUB CODE <span aria-hidden="true">↗</span></a>}
        <details className="film-project-details">
          <summary>Explore architecture & evidence <span aria-hidden="true">+</span></summary>
          <div className="film-project-detail-content">
            <figure className="film-project-diagram">
              <img src={project.diagram} alt={`Conceptual pipeline for ${project.name}`} loading="lazy" decoding="async" width="960" height="330"/>
              <figcaption>{project.evidenceType}</figcaption>
            </figure>
            <div><h4>HOW IT WORKS</h4><p>{project.notes.approach}</p></div>
            <div><h4>TESTING & EVIDENCE</h4><p>{project.notes.validation}</p></div>
            {project.screenshot && <figure className="film-project-evidence-image">
              <img src={project.screenshot} alt="Training accuracy and validation accuracy chart, reproduced from the linked public driver drowsiness notebook" loading="lazy" decoding="async"/>
              <figcaption>Original training plot from the public notebook. This is a training-history visualization, not an independent verification of the resume's 92% figure.</figcaption>
            </figure>}
            {project.sourceUrl ? <p className="film-project-evidence-source">Source code and notebook are available at the linked public GitHub repository.</p> : <p className="film-project-evidence-source">Professional experience summary only; confidential implementation details and screenshots are not public.</p>}
          </div>
        </details>
      </div>
    </m.article>
  )
}
