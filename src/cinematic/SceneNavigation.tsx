import { useEffect, useState } from 'react'

const chapters = [
  { id: 'intro', label: 'The Opening', number: '01' },
  { id: 'universe', label: 'Intelligence Universe', number: '02' },
  { id: 'timeline', label: 'Time Machine', number: '03' },
  { id: 'projects', label: 'Project Universe', number: '04' },
  { id: 'finale', label: 'The Finale', number: '05' },
] as const

/**
 * Lightweight scroll director: the active chapter tracks real visible
 * sections. Anchors work without JavaScript and are fully keyboard accessible.
 */
export function SceneNavigation() {
  const [active, setActive] = useState<string>('intro')

  useEffect(() => {
    const elements = chapters
      .map(chapter => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      entries => {
        const inView = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (inView[0]) setActive(inView[0].target.id)
      },
      { rootMargin: '-28% 0px -28% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    )

    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="film-scene-navigation" aria-label="Jump between cinematic chapters">
      <span className="film-scene-navigation-label" aria-hidden="true">SCENES</span>
      {chapters.map(chapter => (
        <a
          key={chapter.id}
          href={`#${chapter.id}`}
          aria-label={`Chapter ${chapter.number}: ${chapter.label}`}
          aria-current={active === chapter.id ? 'location' : undefined}
          title={chapter.label}
          className={active === chapter.id ? 'is-active' : undefined}
        >
          <span className="film-scene-dot" aria-hidden="true" />
          <span className="film-scene-number" aria-hidden="true">{chapter.number}</span>
        </a>
      ))}
    </nav>
  )
}
