import { m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'text',
}: {
  children: ReactNode
  className?: string
  delay?: number
  variant?: 'text' | 'image' | 'mask'
}) {
  const reduced = useReducedMotion()
  const entrance = variant === 'text'
    ? { opacity: 0, y: 18 }
    : { opacity: variant === 'image' ? 0.5 : 0.7, y: 0, clipPath: 'inset(0 0 16% 0)' }

  return (
    <m.div
      className={className}
      initial={reduced ? false : entrance}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -24px 0px' }}
      transition={{ duration: reduced ? 0 : variant === 'text' ? 0.8 : 1.1, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}
