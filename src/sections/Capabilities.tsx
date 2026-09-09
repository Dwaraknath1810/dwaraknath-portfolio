import { capabilities } from '../data/portfolio'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Reveal } from '../components/ui/Reveal'

export function Capabilities() {
  return (
    <section
      className="section shell capabilities"
      aria-labelledby="capabilities-title"
    >
      <div className="section-heading">
        <SectionLabel number="05">Technical capabilities</SectionLabel>
        <Reveal>
          <h2 id="capabilities-title">
            A considered <span className="text-muted">toolkit.</span>
          </h2>
        </Reveal>
      </div>
      <div className="capability-grid">
        {capabilities.map((group, index) => (
          <div className="capability-group" key={group.title}>
            <span className="eyebrow">/ 0{index + 1}</span>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
