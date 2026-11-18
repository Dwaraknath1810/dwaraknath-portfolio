import { useRef, useState, type PointerEvent } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import fallbackPortrait from '../assets/dwaraknath-portrait.jpg'
import fallbackPortraitSmall from '../assets/dwaraknath-portrait-small.jpg'
import { identity } from '../data/portfolio'

export function Hero() {
  const reduced = useReducedMotion()
  // The optimized transparent portrait lives in public/hero-portrait-cutout.webp.
  // Retain the original photograph as a safe fallback until the asset is uploaded.
  const [showCutout, setShowCutout] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const lightX = useMotionValue(50)
  const lightY = useMotionValue(35)
  const rotateY = useSpring(pointerX, { stiffness: 110, damping: 22 })
  const rotateX = useSpring(pointerY, { stiffness: 110, damping: 22 })
  const glare = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(180, 216, 255, 0.24), transparent 42%)`
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const portraitScrollY = useTransform(scrollYProgress, [0, 1], [0, 64])
  const copyScrollY = useTransform(scrollYProgress, [0, 1], [0, -32])

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    pointerX.set(x * 7)
    pointerY.set(y * -7)
    lightX.set((x + 0.5) * 100)
    lightY.set((y + 0.5) * 100)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
    lightX.set(50)
    lightY.set(35)
  }

  return (
    <section id="top" className="hero shell hero-cinematic" aria-labelledby="hero-title" ref={sectionRef}>
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
        <div className="hero-atmosphere" aria-hidden="true"><span /><span /><span /></div>
        <m.figure
          className={`hero-portrait${showCutout ? " hero-portrait--cutout" : ""}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          style={reduced ? undefined : { y: portraitScrollY, rotateX, rotateY, transformPerspective: 1100 }}
          initial={
            reduced ? false : { opacity: 0.5, clipPath: 'inset(0 0 18% 0)' }
          }
          animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: reduced ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-portrait-halo" aria-hidden="true" />
          <div className="hero-portrait-beam" aria-hidden="true" />
          <m.div className="hero-portrait-glare" style={reduced ? undefined : { background: glare }} aria-hidden="true" />
          <img
            src={showCutout ? '/hero-portrait-cutout.webp' : fallbackPortrait}
            srcSet={showCutout ? undefined : `${fallbackPortraitSmall} 576w, ${fallbackPortrait} 1122w`}
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 49vw, 42vw"
            width="1122"
            height="1402"
            fetchPriority="high"
            decoding="async"
            onError={() => setShowCutout(false)}
            alt={showCutout
              ? 'Dwaraknath Balaji smiling in a black suit against a cinematic navy backdrop.'
              : 'Dwaraknath Balaji wearing a dark suit against a neutral background.'}
          />
          <div className="hero-scan-corners" aria-hidden="true"><span /><span /><span /><span /></div>
          <figcaption className="eyebrow">
            <span>{identity.name}</span>
            <span>Based in {identity.location}</span>
          </figcaption>
        </m.figure>
        <m.div className="hero-copy" style={reduced ? undefined : { y: copyScrollY }}>
          <p className="hero-name eyebrow"><span className="hero-name-index">01 / INTRODUCTION</span>{identity.name}</p>
          <h1 id="hero-title">
            <span className="hero-title-line">
              <m.span
                className="hero-title-word"
                initial={reduced ? false : { y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: reduced ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] }}
              >AI</m.span>
            </span>
            <span className="hero-title-line">
              <m.span
                className="hero-title-word"
                initial={reduced ? false : { y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: reduced ? 0 : 1.05, delay: reduced ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
              >ENGINEER<span className="hero-period">.</span></m.span>
            </span>
          </h1>
          <div className="hero-intro">
            <p className="hero-overline eyebrow">Designing what intelligence becomes.</p>
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
        </m.div>
        <div className="portrait-index eyebrow" aria-hidden="true">
          Human perspective. Machine intelligence.
        </div>
      </div>
      <div className="hero-bottom eyebrow">
        <m.span
          className="hero-rule"
          aria-hidden="true"
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <p>{identity.supportingLine}</p>
        <a href="#about">
          Scroll to explore <ArrowDown size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
