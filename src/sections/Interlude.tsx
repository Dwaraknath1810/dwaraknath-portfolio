import { useRef } from 'react'
import { ArrowDownRight, ArrowUpRight, Fingerprint, ScanLine, Workflow } from 'lucide-react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Reveal } from '../components/ui/Reveal'

const disciplines = [
  { number: '01', icon: Fingerprint, title: 'Knowledge', detail: 'Find the signal in the noise.' },
  { number: '02', icon: Workflow, title: 'Intelligence', detail: 'Connect reasoning to action.' },
  { number: '03', icon: ScanLine, title: 'Reliability', detail: 'Make every answer accountable.' },
]

/**
 * Cinematic, fully local interlude. No autoplay video, external asset or remote
 * image request: the layers are drawn by CSS to keep the page light and fast.
 */
export function Interlude() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sceneY = useTransform(scrollYProgress, [0, 1], [-65, 65])
  const sceneRotate = useTransform(scrollYProgress, [0, 1], [-9, 9])

  return (
    <section className="interlude" aria-labelledby="interlude-title" ref={sectionRef}>
      <div className="interlude-noise" aria-hidden="true" />
      <m.div
        className="interlude-orb"
        aria-hidden="true"
        style={reducedMotion ? undefined : { y: sceneY, rotate: sceneRotate }}
      >
        <div className="interlude-orbit interlude-orbit-outer" />
        <div className="interlude-orbit interlude-orbit-middle" />
        <div className="interlude-orbit interlude-orbit-inner" />
        <div className="interlude-core"><div className="interlude-core-glint" /></div>
        <div className="interlude-axis interlude-axis-one" />
        <div className="interlude-axis interlude-axis-two" />
      </m.div>
      <div className="shell interlude-inner">
        <Reveal>
          <p className="interlude-kicker eyebrow">
            <span className="interlude-led" aria-hidden="true" />
            The intersection of intelligence and engineering
          </p>
          <h2 id="interlude-title">
            From information
            <span> to <em>impact.</em></span>
          </h2>
          <p className="interlude-description">
            Making AI useful takes more than a model. It takes context, a deliberate
            architecture and the discipline to test what comes back.
          </p>
          <a className="interlude-link" href="#work">
            Explore the systems <ArrowDownRight size={19} aria-hidden="true" />
          </a>
        </Reveal>
        <div className="interlude-disciplines" aria-label="Three engineering disciplines">
          {disciplines.map(({ number, icon: Icon, title, detail }) => (
            <Reveal key={number} className="interlude-discipline">
              <div className="interlude-discipline-top">
                <span>{number} / 03</span>
                <Icon size={23} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </Reveal>
          ))}
        </div>
        <span className="interlude-corner interlude-corner-left" aria-hidden="true">DB / SYSTEMS</span>
        <span className="interlude-corner interlude-corner-right" aria-hidden="true">HUMAN × MACHINE <ArrowUpRight size={11}/></span>
      </div>
    </section>
  )
}
