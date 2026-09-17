import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { identity, navigation, sectionIds } from '../../data/portfolio'
import '../../styles/header.css'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const sections = navigation.flatMap(({ id }) => {
      const element = document.getElementById(id)
      return element ? [{ id, element }] : []
    })
    let frame = 0
    let previousSection: string | null = null
    let previousScrolled = false

    const updateNavigation = () => {
      frame = 0
      const nextScrolled = window.scrollY > 24
      const readingLine = Math.min(window.innerHeight * 0.3, 220)
      let nextSection: string | null = null

      for (const section of sections) {
        if (section.element.getBoundingClientRect().top > readingLine) break
        nextSection = section.id
      }
      if (
        nextScrolled &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      ) {
        nextSection = sections.at(-1)?.id ?? null
      }

      // State changes only when a section boundary or the header threshold changes.
      if (nextSection !== previousSection) {
        previousSection = nextSection
        setActiveSection(nextSection)
      }
      if (nextScrolled !== previousScrolled) {
        previousScrolled = nextScrolled
        setScrolled(nextScrolled)
      }
    }
    const scheduleUpdate = () => {
      if (!document.hidden && !frame) frame = window.requestAnimationFrame(updateNavigation)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(scheduleUpdate) : null
    const main = document.getElementById('main-content')
    if (main) resizeObserver?.observe(main)
    scheduleUpdate()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver?.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }

    desktopQuery.addEventListener('change', closeOnDesktop)
    return () => desktopQuery.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header
      className="site-header"
      data-scrolled={scrolled || menuOpen ? true : undefined}
      onBlur={(event) => {
        if (menuOpen && !event.currentTarget.contains(event.relatedTarget)) {
          setMenuOpen(false)
        }
      }}
    >
      <div className="site-header__inner">
        <a
          className="site-header__identity"
          href="#top"
          aria-label={`${identity.name} — back to top`}
          onClick={() => setMenuOpen(false)}
        >
          <span className="site-header__monogram" aria-hidden="true">
            db<span />
          </span>
          <span className="site-header__name">{identity.name}</span>
        </a>

        <nav className="nav-desktop" aria-label="Main navigation">
          {navigation.map(({ id, label }) => (
            <a
              className="nav-desktop__link"
              href={`#${id}`}
              key={id}
              aria-current={activeSection === id ? 'location' : undefined}
            >
              <span>{label}</span>
              {id === 'contact' && <ArrowUpRight size={13} aria-hidden="true" />}
            </a>
          ))}
        </nav>

        <details className="fallback-navigation">
          <summary>Menu</summary>
          <nav aria-label="Navigation">{navigation.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
        </details>
        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? 'mobile-navigation' : undefined}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="nav-mobile" aria-label="Mobile navigation">
          {navigation.map(({ id, label }) => (
            <a
              href={`#${id}`}
              key={id}
              aria-current={activeSection === id ? 'location' : undefined}
              onClick={() => {
                setMenuOpen(false)
                const target = document.getElementById(id)
                target?.setAttribute('tabindex', '-1')
                target?.focus({ preventScroll: true })
              }}
            >
              <span className="nav-mobile__index" aria-hidden="true">
                {String(sectionIds.indexOf(id)).padStart(2, '0')}
              </span>
              <span>{label}</span>
              <ArrowUpRight className="nav-mobile__arrow" size={19} aria-hidden="true" />
            </a>
          ))}
          <p className="nav-mobile__signature">
            {identity.role} / {identity.location}
          </p>
        </nav>
      )}
    </header>
  )
}
