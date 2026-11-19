import { m, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/** A passive visual indicator, rather than another scroll control. */
export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 })
  return (
    <div className="film-reading-progress" aria-hidden="true">
      <m.div
        className="film-reading-progress-bar"
        style={{ scaleX: reduced ? scrollYProgress : smoothProgress }}
      />
    </div>
  )
}
