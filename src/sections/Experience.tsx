import { experience } from '../data/portfolio'
import { Reveal } from '../components/ui/Reveal'
import { SectionLabel } from '../components/ui/SectionLabel'

export function Experience() {
  return (
    <section
      id="experience"
      className="section shell experience"
      aria-labelledby="experience-title"
    >
      <div className="section-heading">
        <SectionLabel number="04">Experience</SectionLabel>
        <Reveal>
          <h2 id="experience-title">
            Built on
            <br />
            <span className="text-muted">engineering.</span>
          </h2>
        </Reveal>
      </div>
      <ol className="experience-list">
        {experience.map((entry, index) => (
          <li key={entry.company} className="experience-entry">
            <div className="experience-marker" aria-hidden="true" />
            <p className="eyebrow experience-index">
              {String(index + 1).padStart(2, '0')} /{' '}
              {entry.previous ? 'Previous experience' : 'AI & product engineering'}
            </p>
            <div>
              <h3>{entry.companyUrl ? <a href={entry.companyUrl} target="_blank" rel="noopener noreferrer" aria-label={`${entry.company} (opens in a new tab)`}>{entry.company}</a> : entry.company}</h3>
              {entry.startDate && <p className="section-description"><time dateTime={entry.startDate}>{entry.startDate}</time> – {entry.current ? 'Present' : entry.endDate ? <time dateTime={entry.endDate}>{entry.endDate}</time> : 'End date not supplied'}</p>}
              {entry.location && <p>{entry.location}</p>}
              {entry.summary && <p className="section-description">{entry.summary}</p>}
              <div className="experience-roles">
                {[entry.primaryRole, ...(entry.additionalRoles ?? [])].map((role) => (
                  <p key={role}>{role}</p>
                ))}
              </div>
              <ul className="experience-focus">
                {entry.engineeringContributions.map((focus) => (
                  <li key={focus}>{focus}</li>
                ))}
              </ul>
              {([['Responsibilities', entry.responsibilities], ['Verified outcomes', entry.verifiedOutcomes], ['Technologies', entry.technologies]] as const).map(([label, items]) => items?.length ? <div key={label}><h4>{label}</h4><ul className="experience-focus">{items.map(item => <li key={item}>{item}</li>)}</ul></div> : null)}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
