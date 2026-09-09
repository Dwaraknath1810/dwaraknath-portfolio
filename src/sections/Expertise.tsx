import { Plus } from 'lucide-react'
import { expertise } from '../data/portfolio'
import { Reveal } from '../components/ui/Reveal'
import { SectionLabel } from '../components/ui/SectionLabel'

export function Expertise() {
  return (
    <section
      id="expertise"
      className="section shell expertise"
      aria-labelledby="expertise-title"
    >
      <div className="section-heading">
        <SectionLabel number="02">Core expertise</SectionLabel>
        <Reveal>
          <h2 id="expertise-title">
            The building blocks
            <br />
            <span className="text-muted">of intelligence.</span>
          </h2>
        </Reveal>
      </div>
      <div className="expertise-list">
        {expertise.map((area) => (
          <details key={area.number} className="expertise-row">
            <summary>
              <span className="eyebrow expertise-number">{area.number}</span>
              <h3>{area.title}</h3>
              <Plus size={22} strokeWidth={1.25} aria-hidden="true" />
            </summary>
            <p>{area.description}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
