import { m, useReducedMotion } from 'framer-motion'

const transitions = [
  { index: 'I → II', line: 'FROM THE PERSON TO THE SYSTEM' },
  { index: 'II → III', line: 'EVERY SYSTEM HAS AN ORIGIN' },
  { index: 'III → IV', line: 'THE IDEAS BECOME REAL' },
  { index: 'IV → V', line: 'WHAT COMES NEXT IS OURS TO BUILD' },
] as const

/** An original film-inspired chapter transition, without blocking scrolling. */
export function SceneDivider({ step }: { step: 0 | 1 | 2 | 3 }) {
  const reduced = useReducedMotion()
  const transition = transitions[step]

  return (
    <div className="film-scene-divider" aria-hidden="true">
      <span className="film-scene-divider-rule"/>
      <m.span
        className="film-scene-divider-center"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .35 }}
        transition={{ duration: reduced ? 0 : .8, ease: [.22, 1, .36, 1] }}
      >
        <span className="film-scene-divider-index">{transition.index}</span>
        {transition.line}
      </m.span>
      <span className="film-scene-divider-rule"/>
    </div>
  )
}
