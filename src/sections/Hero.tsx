import { ArrowDown, ArrowUpRight } from 'lucide-react'
import portrait from '../assets/dwaraknath-portrait.jpg'
import portraitSmall from '../assets/dwaraknath-portrait-small.jpg'
import portraitWebp from '../assets/dwaraknath-portrait.webp'
import portraitSmallWebp from '../assets/dwaraknath-portrait-small.webp'
import portraitMediumWebp from '../assets/dwaraknath-portrait-medium.webp'
import { identity } from '../data/portfolio'
import { useHeroMotion } from '../hooks/useHeroMotion'
import '../styles/hero.css'

export function Hero() {
  const ref = useHeroMotion()
  const [roleLead, ...roleRest] = identity.role.split(' ')
  const sizes = '(max-width: 640px) 82vw, (max-width: 1440px) 46vw, 662px'
  return (
    <section ref={ref} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-stage">
        <div className="hero-atmosphere" aria-hidden="true"><div className="hero-beam" /><div className="hero-orbit" /></div>
        <div className="hero-inner shell">
          <div className="hero-topline eyebrow">
            <span><i className="status-dot" aria-hidden="true" /> Independent thinking. Intelligent systems.</span>
            <span className="hero-edition">Based in {identity.location}</span>
          </div>
          <div className="hero-composition">
            <figure className="hero-portrait">
              <picture>
                <source type="image/webp" srcSet={`${portraitSmallWebp} 480w, ${portraitMediumWebp} 768w, ${portraitWebp} 1122w`} sizes={sizes} />
                <img src={portrait} srcSet={`${portraitSmall} 576w, ${portrait} 1122w`} sizes={sizes}
                  width="1122" height="1402" fetchPriority="high"
                  alt="Dwaraknath Balaji in a dark suit, photographed against a neutral background." />
              </picture>
              <figcaption className="eyebrow">Human perspective.<br />Machine intelligence.</figcaption>
            </figure>
            <div className="hero-copy">
              <p className="hero-name eyebrow">{identity.name}</p>
              <h1 id="hero-title"><span className="hero-title-line"><span className="hero-title-word">{roleLead}</span></span><span className="hero-title-line"><span className="hero-title-word">{roleRest.join(' ')}<span className="hero-period">.</span></span></span></h1>
              <div className="hero-intro">
                <div className="hero-intro-mask"><p>{identity.positioning}</p></div>
                <div className="hero-cta-mask"><div className="hero-links">
                  <a className="text-link" href="#work">Selected work <ArrowDown size={16} aria-hidden="true" /></a>
                  <a className="text-link text-link-muted" href="#contact">Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
                </div></div>
              </div>
            </div>
            <span className="portrait-index eyebrow" aria-hidden="true">01 — A human behind the systems</span>
          </div>
          <div className="hero-bottom eyebrow">
            <p>{identity.supportingLine}</p>
            <a href="#about">Explore the perspective <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
