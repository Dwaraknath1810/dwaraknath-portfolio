import { ArrowUpRight, Plus } from 'lucide-react'
import { projects } from '../data/portfolio'
import { ProjectArtwork } from '../components/ui/ProjectArtwork'
import { Reveal } from '../components/ui/Reveal'
import { SectionLabel } from '../components/ui/SectionLabel'

export function Projects() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="shell">
        <div className="section-heading work-heading">
          <SectionLabel number="03">Selected work</SectionLabel>
          <Reveal>
            <h2 id="work-title">
              Systems, <span className="text-muted">with purpose.</span>
            </h2>
            <p className="section-description">
              Three directions in applied intelligence.
              <br />
              From the right context to a reliable outcome.
            </p>
          </Reveal>
        </div>
        <div className="projects-list">
          {projects.map((project) => (
            <article
              className={`project project-${project.kind}`}
              key={project.number}
              aria-labelledby={`project-${project.number}`}
            >
              <Reveal className="project-visual">
                <div className="project-visual-top eyebrow">
                  <span>Study / {project.number}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
                <ProjectArtwork kind={project.kind} />
                <span className="project-visual-caption eyebrow">
                  Conceptual system study
                </span>
              </Reveal>
              <div className="project-copy">
                <p className="eyebrow project-number">
                  {project.number} / {project.status}
                </p>
                <h3 id={`project-${project.number}`}>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <ul className="tag-list" aria-label="Project focus">
                  {project.focus.map((focus) => (
                    <li key={focus}>{focus}</li>
                  ))}
                </ul>
                <details className="project-details">
                  <summary className="text-link">
                    Explore the approach <Plus size={17} aria-hidden="true" />
                  </summary>
                  <ul>
                    {project.detail.approach.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
