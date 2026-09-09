import { Reveal } from '../components/ui/Reveal'
import { SectionLabel } from '../components/ui/SectionLabel'
import { aboutStatement } from '../data/portfolio'

export function About() {
  return (
    <section
      id="about"
      className="section shell about"
      aria-labelledby="about-title"
    >
      <SectionLabel number="01">A little context</SectionLabel>
      <Reveal className="about-content">
        <h2 id="about-title">
          Intelligence is useful.
          <br />
          <span className="text-muted">
            Dependability makes
            <br className="desktop-break" /> it matter.
          </span>
        </h2>
        <div className="about-bottom">
          <span className="eyebrow about-note">
            Context → Intelligence → Impact
          </span>
          <p>{aboutStatement}</p>
        </div>
      </Reveal>
    </section>
  )
}
