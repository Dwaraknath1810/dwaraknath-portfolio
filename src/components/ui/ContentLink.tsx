import type { ReactNode } from 'react'
import type { CaseStudyUrl } from '../../data/portfolio'

export function ContentLink({ href, children }: { href: CaseStudyUrl; children: ReactNode }) {
  const external = href.startsWith('https://')
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
    {children}{external && <span className="sr-only"> (opens in a new tab)</span>}
  </a>
}
