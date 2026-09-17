import { useEffect, useRef } from 'react'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

/** Event-driven: layout reads on resize, transform writes in a single frame. */
export function useHeroMotion() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = ref.current
    const stage = element?.querySelector<HTMLElement>('.hero-stage')
    if (!element || !stage || !('IntersectionObserver' in window)) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
    const compact = matchMedia('(max-width: 640px), (max-height: 699px)')
    let active = false
    let enabled = false
    let frame = 0
    let top = 0
    let range = 1
    let width = 1
    let stageHeight = 1
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0

    const tick = () => {
      frame = 0
      if (!enabled || !active || document.hidden) return
      const progress = clamp((window.scrollY - top) / range)
      x += (targetX - x) * 0.12
      y += (targetY - y) * 0.12
      if (Math.abs(targetX - x) < 0.002) x = targetX
      if (Math.abs(targetY - y) < 0.002) y = targetY
      // Only the enhanced desktop cover hides content; static HTML is complete.
      const phase = (start: number, end: number) => clamp((progress - start) / (end - start)).toFixed(4)
      element.style.setProperty('--hero-progress', progress.toFixed(4))
      element.style.setProperty('--portrait-stage', phase(0, 0.75))
      element.style.setProperty('--title-stage', phase(0.1, 0.35))
      element.style.setProperty('--title-ai-stage', phase(0.1, 0.25))
      element.style.setProperty('--title-engineer-stage', phase(0.18, 0.35))
      element.style.setProperty('--intro-stage', phase(0.35, 0.6))
      element.style.setProperty('--cta-stage', phase(0.5, 0.75))
      element.style.setProperty('--exit-stage', phase(0.75, 1))
      element.toggleAttribute('data-cta-ready', progress >= 0.75)
      element.style.setProperty('--pointer-x', x.toFixed(4))
      element.style.setProperty('--pointer-y', y.toFixed(4))
      if (x !== targetX || y !== targetY) frame = requestAnimationFrame(tick)
    }
    const schedule = () => {
      if (enabled && active && !document.hidden && !frame) frame = requestAnimationFrame(tick)
    }
    const measure = () => {
      // Read together before any style writes. svh avoids mobile toolbar resize jumps.
      const box = element.getBoundingClientRect()
      top = box.top + window.scrollY
      stageHeight = stage.offsetHeight
      range = Math.max(1, element.offsetHeight - stageHeight)
      width = element.clientWidth
      schedule()
    }
    const resetPointer = () => { targetX = 0; targetY = 0; schedule() }
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || compact.matches || event.pointerType !== 'mouse') return
      targetX = Math.max(-1, Math.min(1, event.clientX / width * 2 - 1))
      targetY = Math.max(-1, Math.min(1, event.clientY / stageHeight * 2 - 1))
      schedule()
    }
    const configure = () => {
      enabled = !reduced.matches && !compact.matches
        && CSS.supports('position', 'sticky')
      if (enabled) element.dataset.motion = 'enabled'
      else {
        delete element.dataset.motion
        element.removeAttribute('data-cta-ready')
        element.removeAttribute('style')
        cancelAnimationFrame(frame)
        frame = 0
      }
      resetPointer()
      measure()
    }
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0 }
      else { measure(); schedule() }
    }
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      if (active) { measure(); schedule() }
      else {
        cancelAnimationFrame(frame)
        frame = 0
        x = y = targetX = targetY = 0
        element.style.setProperty('--pointer-x', '0')
        element.style.setProperty('--pointer-y', '0')
      }
    })
    observer.observe(element)
    configure()
    const resize = 'ResizeObserver' in window ? new ResizeObserver(measure) : null
    resize?.observe(element)
    resize?.observe(stage)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', configure, { passive: true })
    stage.addEventListener('pointermove', move, { passive: true })
    stage.addEventListener('pointerleave', resetPointer)
    document.addEventListener('visibilitychange', visibility)
    reduced.addEventListener('change', configure)
    finePointer.addEventListener('change', resetPointer)
    return () => {
      observer.disconnect()
      resize?.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', configure)
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', resetPointer)
      document.removeEventListener('visibilitychange', visibility)
      reduced.removeEventListener('change', configure)
      finePointer.removeEventListener('change', resetPointer)
      delete element.dataset.motion
      element.removeAttribute('data-cta-ready')
      element.removeAttribute('style')
    }
  }, [])
  return ref
}
