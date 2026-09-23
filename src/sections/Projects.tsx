import { Plus } from 'lucide-react'
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
              <div className="project-index">
                <span className="project-index-number" aria-label={`Study ${project.number}`}>{project.number}</span>
                <div className="project-index-meta eyebrow">
                  <span>{project.focus.slice(0, 2).join(' / ')}</span>
                  <span>{project.projectType}</span>
                </div>
              </div>
              <Reveal className="project-visual" variant="image">
                <ProjectArtwork kind={project.kind} />
              </Reveal>
              <div className="project-copy">
                <p className="eyebrow project-number">
                  {project.status}
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
                  {([['Objective', project.objective], ['Context', project.context], ['Role', project.role], ['Evaluation method', project.evaluationMethod]] as const).map(([label, value]) => value ? <div key={label}><h4>{label}</h4><p>{value}</p></div> : null)}
                  <h4>{project.status === 'Project direction' ? 'Proposed technical approach' : 'Technical approach'}</h4>
                  <ul>
                    {project.technicalApproach.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                  {([['Responsibilities', project.responsibilities], ['Architecture', project.architecture], ['Engineering decisions', project.engineeringDecisions], ['Constraints', project.constraints], ['Challenges', project.challenges], ['Verified outcomes', project.verifiedOutcomes], ['Stack', project.stack]] as const).map(([label, items]) => items?.length ? <div key={label}><h4>{label}</h4><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></div> : null)}
                  {project.media?.map(media => <img key={media.src} {...media} loading="lazy" />)}
                  {([['Repository', project.repositoryUrl], ['Demo', project.demoUrl], ['Case study', project.caseStudyUrl]] as const).map(([label, url]) => url ? <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}<span className="sr-only"> (opens in a new tab)</span></a> : null)}
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
