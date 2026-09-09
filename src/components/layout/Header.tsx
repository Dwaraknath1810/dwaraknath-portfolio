import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { identity, navigation } from '../../data/portfolio'
import '../../styles/header.css'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

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
    <header className="site-header">
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
            <a className="nav-desktop__link" href={`#${id}`} key={id}>
              <span>{label}</span>
              {id === 'contact' && <ArrowUpRight size={13} aria-hidden="true" />}
            </a>
          ))}
        </nav>

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
          {navigation.map(({ id, label }, index) => (
            <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
              <span className="nav-mobile__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{label}</span>
              <ArrowUpRight className="nav-mobile__arrow" size={19} aria-hidden="true" />
            </a>
          ))}
          <p className="nav-mobile__signature">{identity.role} / {identity.location}</p>
        </nav>
      )}
    </header>
  )
}
