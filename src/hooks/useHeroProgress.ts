import { useEffect, useRef } from 'react'
import { heroStages, type HeroStages } from './hero-progress'

export interface HeroController {
  stages: HeroStages
  pointer: { x: number; y: number }
  active: boolean
  notify: (() => void) | null
}
export function useHeroProgress() {
  const section = useRef<HTMLElement>(null)
  const controller = useRef<HeroController>({ stages: heroStages(1), pointer: { x: 0, y: 0 }, active: true, notify: null })
  useEffect(() => {
    const element = section.current
    if (!element) return
    const motion = matchMedia('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)')
    let start = 0, distance = 1, bottom = 0, frame = 0
    let forced = false, fallback = false
    const update = () => {
      frame = 0
      const state = controller.current
      state.active = !document.hidden && scrollY + innerHeight > start && scrollY < bottom
      state.stages = heroStages(motion.matches && !fallback && !forced ? (scrollY - start) / distance : 1)
      for (const [key, value] of Object.entries(state.stages)) element.style.setProperty(`--${key}`, String(value))
      element.dataset.progress = state.stages.overall.toFixed(3)
      if (state.active) state.notify?.()
    }
    const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update) }
    const measure = () => {
      element.dataset.sequence = String(motion.matches && !fallback)
      start = element.getBoundingClientRect().top + scrollY
      distance = Math.max(1, element.offsetHeight - innerHeight)
      bottom = start + element.offsetHeight
      schedule()
    }
    const fail = () => { fallback = true; measure() }
    const focus = () => { forced = true; update() }
    const pointer = (event: PointerEvent) => {
      if (!motion.matches || !controller.current.active || event.pointerType !== 'mouse') return
      controller.current.pointer.x = (event.clientX / innerWidth - 0.5) * 2
      controller.current.pointer.y = (event.clientY / innerHeight - 0.5) * 2
      schedule()
    }
    const reset = () => { controller.current.pointer.x = 0; controller.current.pointer.y = 0; schedule() }
    const visibility = () => {
      controller.current.active = !document.hidden && scrollY < bottom
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0 }
      else schedule()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    element.addEventListener('hero:fallback', fail)
    element.addEventListener('focusin', focus)
    element.addEventListener('pointermove', pointer)
    element.addEventListener('pointerleave', reset)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    document.addEventListener('visibilitychange', visibility)
    motion.addEventListener('change', measure)
    measure()
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame)
      element.removeEventListener('hero:fallback', fail)
      element.removeEventListener('focusin', focus)
      element.removeEventListener('pointermove', pointer)
      element.removeEventListener('pointerleave', reset)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', visibility)
      motion.removeEventListener('change', measure)
      delete element.dataset.sequence
    }
  }, [])
  return { section, controller }
}
