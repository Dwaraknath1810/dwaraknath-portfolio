import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { identity } from '../data/portfolio'
import { WebGLFallback } from '../components/three/WebGLFallback'
import { useHeroProgress } from '../hooks/useHeroProgress'

const HeroCanvas = lazy(() => import('../components/three/HeroCanvas'))
export function Hero() {
  const { section, controller } = useHeroProgress()
  const [enhanced, setEnhanced] = useState(false)
  useEffect(() => {
    const query = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    let timer = 0, disposed = false
    const enhance = () => {
      const image = document.querySelector<HTMLImageElement>('.hero-portrait img')
      void (image?.decode() ?? Promise.resolve()).catch(() => {}).then(() => {
        if (!disposed && query.matches) setEnhanced(true)
      })
    }
    const update = () => {
      clearTimeout(timer)
      if (!query.matches) { setEnhanced(false); return }
      // Let the HTML, font and portrait paint before requesting the optional 3D bundle.
      timer = window.setTimeout(enhance, 1200)
    }
    update(); query.addEventListener('change', update)
    return () => { disposed = true; clearTimeout(timer); query.removeEventListener('change', update) }
  }, [])
  return (
    <section ref={section} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-stage shell">
        <div className="hero-topline eyebrow"><span><i className="status-dot" /> Human perspective. Machine intelligence.</span><span className="hero-edition">Portfolio / {new Date().getFullYear()}</span></div>
        <div className="hero-composition">
          <div className="hero-atmosphere" aria-hidden="true"><i /><i /><i /></div>
          <figure className="hero-portrait">
            <picture>
              <source type="image/webp" srcSet="/images/portrait-480.webp 480w, /images/portrait-800.webp 800w, /images/portrait-1122.webp 1122w" sizes="(max-width: 640px) 82vw, (max-width: 1023px) 48vw, 480px" />
              <img src="/images/portrait-1122.jpg" srcSet="/images/portrait-480.jpg 480w, /images/portrait-800.jpg 800w, /images/portrait-1122.jpg 1122w" sizes="(max-width: 640px) 82vw, (max-width: 1023px) 48vw, 480px" width="1122" height="1402" fetchPriority="high" alt="Dwaraknath Balaji wearing a dark suit, photographed against a neutral background." />
            </picture>
            <figcaption className="eyebrow"><span>{identity.name}</span><span>Based in {identity.location}</span></figcaption>
          </figure>
          {enhanced && <WebGLFallback><Suspense fallback={null}><HeroCanvas controller={controller} /></Suspense></WebGLFallback>}
          <div className="hero-copy">
            <p className="hero-name eyebrow">{identity.name}<span> / AI engineering</span></p>
            <h1 id="hero-title" aria-label={`${identity.name} — ${identity.role}`}>
              <span className="hero-title-line"><span className="hero-title-word">AI</span></span>
              <span className="hero-title-line"><span className="hero-title-word">ENGINEER<span className="hero-period">.</span></span></span>
            </h1>
            <div className="hero-intro"><p>{identity.positioning}</p></div>
            <div className="hero-links">
              <a className="text-link" href="#work">Selected work <ArrowDown size={16} aria-hidden="true" /></a>
              <a className="text-link text-link-muted" href="#contact">Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <p className="portrait-index eyebrow" aria-hidden="true">Context → Reasoning → Action</p>
        </div>
        <div className="hero-bottom eyebrow"><p>{identity.supportingLine}</p><a href="#about">Scroll to explore <ArrowDown size={16} aria-hidden="true" /></a></div>
        <div className="hero-progress" aria-hidden="true" />
      </div>
    </section>
  )
}
