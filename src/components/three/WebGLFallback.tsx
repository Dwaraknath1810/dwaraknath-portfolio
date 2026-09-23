import { Component, type ReactNode } from 'react'

// Outside the lazy chunk: a failed download must never unmount the HTML portfolio.
export class WebGLFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() {
    document.getElementById('top')?.dispatchEvent(new Event('hero:fallback'))
  }
  render() { return this.state.failed ? null : this.props.children }
}
