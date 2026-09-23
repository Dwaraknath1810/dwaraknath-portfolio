import { useEffect, useRef, type ReactNode } from 'react'

export function Reveal({ children, className = '', delay = 0, variant = 'text' }: {
  children: ReactNode; className?: string; delay?: number; variant?: 'text' | 'image' | 'mask'
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Content remains visible by default, including when JS or IO is unavailable.
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add('reveal-enter')
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={className} data-reveal={variant} style={{ animationDelay: `${delay}s` }}>{children}</div>
}
