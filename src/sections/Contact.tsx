import { ArrowUpRight } from 'lucide-react'
import { contactLinks } from '../data/portfolio'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Reveal } from '../components/ui/Reveal'

export function Contact() {
  return (
    <section
      id="contact"
      className="section shell contact"
      aria-labelledby="contact-title"
    >
      <SectionLabel number="07">What’s next</SectionLabel>
      <Reveal variant="mask">
        <h2 id="contact-title">
          LET’S BUILD
          <br />
          <span className="text-muted">INTELLIGENT</span>
          <br />
          SYSTEMS<span className="contact-dot">.</span>
          <ArrowUpRight
            aria-hidden="true"
            className="contact-title-arrow"
            strokeWidth={0.75}
          />
        </h2>
      </Reveal>
      <div className="contact-bottom">
        <p>
          Good systems start
          <br />
          with a conversation.
        </p>
        <ul className="contact-links">
          {contactLinks.map(({ id, label, href, displayValue, external, accessibleLabel }) => {
            return (
              <li key={id}>
                <a
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  aria-label={accessibleLabel}
                >
                  <span>
                    {label}
                    <small>{displayValue}</small>
                  </span>
                  <ArrowUpRight size={20} strokeWidth={1.2} aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
