import { Component, useEffect, useState, useCallback, type ReactNode, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { WebGLRenderer } from 'three'
import type { HeroController } from '../../hooks/useHeroProgress'
import { HeroScene } from './HeroScene'

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

export default function HeroCanvas({ controller }: { controller: RefObject<HeroController> }) {
  const [failed, setFailed] = useState(false)
  const onLost = useCallback(() => setFailed(true), [])
  const [supported] = useState(() => {
    const probe = document.createElement('canvas')
    const context = probe.getContext('webgl2')
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(context)
  })
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    if (!supported || failed) document.getElementById('top')?.dispatchEvent(new Event('hero:fallback'))
  }, [supported, failed])
  useEffect(() => {
    const element = document.getElementById('top')!
    const update = () => setVisible(!document.hidden && element.getBoundingClientRect().bottom > 0 && element.getBoundingClientRect().top < innerHeight)
    const observer = new IntersectionObserver(update)
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  if (failed || !supported) return null
  return <div className="hero-canvas" aria-hidden="true" data-webgl="true">
    <SceneBoundary onError={onLost}>
      <Canvas frameloop={visible ? 'demand' : 'never'} dpr={[1, 1.35]} camera={{ position: [0, 0, 8], fov: 40 }}
        fallback={null}
        gl={async (defaults) => {
          // Probe before constructing Three's renderer: failure stays silent and photographic.
          const canvas = defaults.canvas as HTMLCanvasElement
          const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
          if (!context) { setFailed(true); throw new Error('Decorative WebGL unavailable') }
          const renderer = new WebGLRenderer({ ...defaults, canvas, context, alpha: true, antialias: true, powerPreference: 'low-power' })
          return renderer
        }}>
        <HeroScene controller={controller} onLost={onLost} />
      </Canvas>
    </SceneBoundary>
  </div>
}
