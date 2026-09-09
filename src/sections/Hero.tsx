import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { m, useReducedMotion } from 'framer-motion'
import portrait from '../assets/dwaraknath-portrait.jpg'
import portraitSmall from '../assets/dwaraknath-portrait-small.jpg'
import { identity } from '../data/portfolio'

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section id="top" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-topline eyebrow">
        <span>
          <i className="status-dot" />
          Independent thinking. Intelligent systems.
        </span>
        <span className="hero-edition">
          Portfolio — {new Date().getFullYear()}
        </span>
      </div>
      <div className="hero-composition">
        <m.figure
          className="hero-portrait"
          initial={
            reduced ? false : { opacity: 0, clipPath: 'inset(6% 0 0 0)' }
          }
          animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={portrait}
            srcSet={`${portraitSmall} 576w, ${portrait} 1122w`}
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 49vw, 42vw"
            width="1122"
            height="1402"
            fetchPriority="high"
            alt="Dwaraknath Balaji wearing a dark suit, photographed against a neutral background."
          />
          <figcaption className="eyebrow">
            <span>{identity.name}</span>
            <span>Based in {identity.location}</span>
          </figcaption>
        </m.figure>
        <div className="hero-copy">
          <p className="hero-name eyebrow">{identity.name}</p>
          <m.h1
            id="hero-title"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>AI</span>
            <span>
              ENGINEER<span className="hero-period">.</span>
            </span>
          </m.h1>
          <div className="hero-intro">
            <p>{identity.positioning}</p>
            <div className="hero-links flex flex-wrap items-center gap-x-8 gap-y-4">
              <a className="text-link" href="#work">
                Selected work <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a className="text-link text-link-muted" href="#contact">
                Let’s talk <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <div className="portrait-index eyebrow" aria-hidden="true">
          Human perspective. Machine intelligence.
        </div>
      </div>
      <div className="hero-bottom eyebrow">
        <p>{identity.supportingLine}</p>
        <a href="#about">
          Scroll to explore <ArrowDown size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
