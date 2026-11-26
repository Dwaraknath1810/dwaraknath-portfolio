import { useEffect, type RefObject } from 'react'

const cardSelector = [
  '.film-skill-card',
  '.film-timeline-card',
  '.film-project-card',
  '.film-brief-panel',
  '.film-brief-proof',
  '.film-workbench-feature',
  '.film-workbench-tool',
  '.film-workbench-evidence',
  '.film-workbench-metric',
].join(',')

const radius = 48

/** Highlight only the closest card, including when the cursor is just outside it. */
export function useCardProximity(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = root.current
    if (!element) return
    const media = window.matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let active: HTMLElement | null = null
    let point: { x: number; y: number } | null = null

    function clear() {
      if (active) {
        active.removeAttribute('data-proximity')
        active.style.removeProperty('--card-pointer-x')
        active.style.removeProperty('--card-pointer-y')
        active = null
      }
    }

    function paint() {
      frame = 0
      if (!element || !point || !media.matches) { clear(); return }
      const { x, y } = point
      let closest: HTMLElement | null = null
      let closestDistance = radius
      let closestArea = Infinity
      for (const card of element.querySelectorAll<HTMLElement>(cardSelector)) {
        const rect = card.getBoundingClientRect()
        if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) continue
        const distance = Math.hypot(Math.max(rect.left - x, 0, x - rect.right), Math.max(rect.top - y, 0, y - rect.bottom))
        const area = rect.width * rect.height
        if (distance < closestDistance || (distance === closestDistance && distance < radius && area < closestArea)) {
          closest = card
          closestDistance = distance
          closestArea = area
        }
      }
      if (active !== closest) { clear(); active = closest }
      if (!active) return
      const rect = active.getBoundingClientRect()
      active.style.setProperty('--card-pointer-x', `${Math.max(0, Math.min(rect.width, x - rect.left))}px`)
      active.style.setProperty('--card-pointer-y', `${Math.max(0, Math.min(rect.height, y - rect.top))}px`)
      active.setAttribute('data-proximity', 'true')
    }

    function queue() {
      if (!frame) frame = window.requestAnimationFrame(paint)
    }
    function stop() {
      point = null
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      clear()
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !media.matches) { stop(); return }
      point = { x: event.clientX, y: event.clientY }
      queue()
    }
    function onScroll() { if (point) queue() }
    function onMedia() { if (!media.matches) stop() }

    element.addEventListener('pointermove', move, { passive: true })
    element.addEventListener('pointerleave', stop)
    element.addEventListener('pointercancel', stop)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('blur', stop)
    media.addEventListener('change', onMedia)
    return () => {
      stop()
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', stop)
      element.removeEventListener('pointercancel', stop)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('blur', stop)
      media.removeEventListener('change', onMedia)
    }
  }, [root])
}
