import { ArrowUpRight } from 'lucide-react'
import { contactLinks } from '../data/portfolio'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Reveal } from '../components/ui/Reveal'

function contactHref(label: string, value: string) {
  if (value.startsWith('YOUR_')) return null
  if (label === 'Email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? `mailto:${value}` : null
  }

  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

export function Contact() {
  return (
    <section
      id="contact"
      className="section shell contact"
      aria-labelledby="contact-title"
    >
      <SectionLabel number="07">What’s next</SectionLabel>
      <Reveal>
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
          {contactLinks.map(({ label, value }) => {
            const href = contactHref(label, value)
            const content = (
              <>
                <span>
                  {label}
                  <small>
                    {href ? (label === 'Email' ? value : 'Let’s connect') : value}
                  </small>
                </span>
                <ArrowUpRight size={20} strokeWidth={1.2} aria-hidden="true" />
              </>
            )

            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    target={label === 'Email' ? undefined : '_blank'}
                    rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                  >
                    {content}
                  </a>
                ) : (
                  <span
                    className="contact-placeholder"
                    aria-label={`${label}: contact details coming soon`}
                  >
                    {content}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
