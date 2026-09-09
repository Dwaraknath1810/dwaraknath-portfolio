import { ArrowDownRight } from 'lucide-react'
import { philosophy } from '../data/portfolio'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Reveal } from '../components/ui/Reveal'

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="section philosophy"
      aria-labelledby="philosophy-title"
    >
      <div className="shell">
        <div className="philosophy-header">
          <SectionLabel number="06">Engineering philosophy</SectionLabel>
          <h2 id="philosophy-title">
            A system is only as strong
            <br />
            as the loop that improves it.
          </h2>
        </div>
        <Reveal>
          <ol className="philosophy-list">
            {philosophy.map((principle, index) => (
              <li key={principle.word}>
                <span className="eyebrow philosophy-number">0{index + 1}</span>
                <h3>
                  {principle.word}
                  <span className="philosophy-dot">.</span>
                </h3>
                <p>{principle.description}</p>
                <ArrowDownRight
                  className="philosophy-arrow"
                  size={32}
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>
        </Reveal>
        <p className="philosophy-footer eyebrow">
          <span className="loop-mark" aria-hidden="true">
            ↳
          </span>{' '}
          An ongoing loop. A deliberate practice.
        </p>
      </div>
    </section>
  )
}
