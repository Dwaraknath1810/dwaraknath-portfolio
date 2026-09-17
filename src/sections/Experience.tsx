import { experience } from '../data/portfolio'
import { Reveal } from '../components/ui/Reveal'
import { SectionLabel } from '../components/ui/SectionLabel'
import { ContentLink } from '../components/ui/ContentLink'

function dateLabel(value: string) {
  const date = new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00Z`)
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export function Experience() {
  return (
    <section id="experience" className="section shell experience" aria-labelledby="experience-title">
      <div className="section-heading">
        <SectionLabel number="04">Experience</SectionLabel>
        <Reveal><h2 id="experience-title">Built on<br /><span className="text-muted">engineering.</span></h2></Reveal>
      </div>
      <ol className="experience-list">
        {experience.map((entry, index) => (
          <li key={entry.company} className="experience-entry">
            <div className="experience-marker" aria-hidden="true" />
            <div className="experience-meta">
              <p className="eyebrow experience-index">{String(index + 1).padStart(2, '0')} / {entry.current ? 'Current role' : 'Previous experience'}</p>
              {(entry.startDate || entry.endDate) && <p className="experience-dates">
                {entry.startDate && <time dateTime={entry.startDate}>{dateLabel(entry.startDate)}</time>}
                {entry.startDate && (entry.endDate || entry.current) && ' — '}
                {entry.current ? 'Present' : entry.endDate && <time dateTime={entry.endDate}>{dateLabel(entry.endDate)}</time>}
              </p>}
              {entry.location && <p>{entry.location}</p>}
            </div>
            <div>
              <h3>{entry.companyUrl ? <ContentLink href={entry.companyUrl}>{entry.company}</ContentLink> : entry.company}</h3>
              <p className="experience-primary-role">{entry.primaryRole}</p>
              {entry.additionalRoles?.length ? <div className="experience-roles">{entry.additionalRoles.map(role => <p key={role}>Additional role · {role}</p>)}</div> : null}
              {entry.summary && <p className="experience-summary">{entry.summary}</p>}
              {([
                ['Responsibilities', entry.responsibilities], ['Engineering contributions', entry.contributions], ['Highlights', entry.highlights],
              ] as const).map(([title, items]) => items?.length ? <div className="experience-detail" key={title}>
                <h4>{title}</h4><ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
              </div> : null)}
              {entry.technologies?.length ? <ul className="tag-list" aria-label="Technologies">{entry.technologies.map(item => <li key={item}>{item}</li>)}</ul> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
