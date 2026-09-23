/* Three objects and this imperative controller are intentionally mutable outside React renders. */
/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'
import type { HeroController } from '../../hooks/useHeroProgress'
import { IntelligenceField } from './IntelligenceField'

export function HeroScene({ controller, onLost }: { controller: RefObject<HeroController>; onLost: () => void }) {
  const group = useRef<Group>(null)
  const { gl, invalidate, camera } = useThree()
  useEffect(() => {
    const state = controller.current
    state.notify = invalidate
    const canvas = gl.domElement
    const lost = (event: Event) => { event.preventDefault(); onLost() }
    canvas.addEventListener('webglcontextlost', lost)
    invalidate()
    return () => { state.notify = null; canvas.removeEventListener('webglcontextlost', lost) }
  }, [controller, gl, invalidate, onLost])
  useFrame(() => {
    const state = controller.current
    if (!state.active || document.hidden || !group.current) return
    const { geometry, exit } = state.stages
    const rotationY = state.pointer.x * 0.025 + geometry * 0.12
    const rotationX = state.pointer.y * 0.018
    group.current.rotation.y += (rotationY - group.current.rotation.y) * 0.22
    group.current.rotation.x += (rotationX - group.current.rotation.x) * 0.22
    group.current.rotation.z = -0.12 + geometry * 0.07
    group.current.scale.setScalar(0.88 + geometry * 0.12)
    camera.position.z = 8 - geometry * 0.35 + exit * 0.1
    gl.domElement.dataset.frames = String(Number(gl.domElement.dataset.frames ?? 0) + 1)
    if (Math.abs(rotationY - group.current.rotation.y) + Math.abs(rotationX - group.current.rotation.x) > 0.0002) invalidate()
  })
  return <>
    <ambientLight intensity={0.6} />
    <pointLight position={[3, 3, 4]} color="#abc2d4" intensity={24} />
    <pointLight position={[-2, -1, 2]} color="#9990c2" intensity={6} />
    <group ref={group} position={[1.2, 0, -0.4]}>
      <IntelligenceField controller={controller} />
    </group>
  </>
}
