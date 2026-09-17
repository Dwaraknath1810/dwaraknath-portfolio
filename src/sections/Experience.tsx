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
              <h3>{entry.company}</h3>
              <div className="experience-roles">
                {entry.roles.map((role) => (
                  <p key={role}>{role}</p>
                ))}
              </div>
              <ul className="experience-focus">
                {entry.focus.map((focus) => (
                  <li key={focus}>{focus}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
