import { Plus } from 'lucide-react'
import type { Project } from '../../data/portfolio'
import { ContentLink } from './ContentLink'

export function ProjectDetails({ project }: { project: Project }) {
  const paragraphs = [
    ['Objective', project.objective], ['Context', project.context], ['My role', project.role],
    ['Architecture', project.architecture], ['Evaluation method', project.evaluation],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()))
  const lists: readonly [string, readonly string[] | undefined][] = [
    ['Responsibilities', project.responsibilities],
    [project.status === 'Project direction' ? 'Proposed technical approach' : 'Technical approach', project.technicalApproach],
    ['Engineering decisions', project.decisions], ['Constraints', project.constraints],
    ['Challenges', project.challenges], ['Outcomes', project.outcomes], ['Technology stack', project.stack],
  ]
  const populatedLists = lists.map(([title, items]) => [title, items?.filter(item => item.trim())] as const).filter(([, items]) => items?.length)
  const hasDetails = paragraphs.length > 0 || populatedLists.length > 0 || Boolean(project.media?.length)
  return <>
    {hasDetails && <details className="project-details">
      <summary className="text-link">Explore the approach <Plus size={17} aria-hidden="true" /></summary>
      <div className="case-study-content">
        {paragraphs.map(([title, text]) => <div key={title}><h4>{title}</h4><p>{text}</p></div>)}
        {populatedLists.map(([title, items]) => <div key={title}><h4>{title}</h4><ul>{items!.map(item => <li key={item}>{item}</li>)}</ul></div>)}
        {project.media?.map(media => <figure key={media.src}>
          <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" />
          {media.caption && <figcaption>{media.caption}</figcaption>}
        </figure>)}
      </div>
    </details>}
    {!project.caseStudyUrl && <p className="case-study-status">Detailed case study in preparation.</p>}
    {(project.repositoryUrl || project.demoUrl || project.caseStudyUrl) && <ul className="project-links">
      {project.repositoryUrl && <li><ContentLink href={project.repositoryUrl}>Repository</ContentLink></li>}
      {project.demoUrl && <li><ContentLink href={project.demoUrl}>Demo</ContentLink></li>}
      {project.caseStudyUrl && <li><ContentLink href={project.caseStudyUrl}>Detailed case study</ContentLink></li>}
    </ul>}
  </>
}
