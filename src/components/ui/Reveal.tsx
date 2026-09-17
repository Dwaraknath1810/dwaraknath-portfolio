import { useEffect, useRef, type ReactNode } from 'react'

export function Reveal({ children, className = '', variant = 'text' }: {
  children: ReactNode
  className?: string
  variant?: 'text' | 'image' | 'mask'
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      if (!motion.matches && !document.hidden) element.dataset.revealing = 'true'
      observer.disconnect()
    }, { threshold: 0.08 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`} data-variant={variant}>{children}</div>
}
