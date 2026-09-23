import { ArrowUp } from 'lucide-react'
import { identity } from '../../data/portfolio'

export function Footer() {
  return (
    <footer className="site-footer shell eyebrow">
      <div>
        <span>{identity.name}</span>
        <span className="text-muted">{identity.role}</span>
      </div>
      <p>© {new Date().getFullYear()}</p>
      <a href="#top">
        Back to top <ArrowUp size={14} aria-hidden="true" />
      </a>
    </footer>
  )
}
