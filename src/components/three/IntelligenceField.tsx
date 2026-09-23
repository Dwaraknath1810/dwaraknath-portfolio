import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, BufferGeometry } from 'three'
import type { HeroController } from '../../hooks/useHeroProgress'

// Deterministic geometry, no textures, particles, postprocessing or per-frame allocations.
const nodes: [number, number, number][] = [
  [-2.8, 0.4, 0], [-2.2, 1.6, -0.6], [-1.1, 2.05, 0.1], [0.9, 2.0, -0.6],
  [2.4, 1.1, 0], [2.9, -0.4, -0.6], [1.9, -1.7, 0.2], [0, -2.0, -0.2], [-1.9, -1.4, 0.3],
]
const edges = new Float32Array(nodes.flatMap((node, index) => [...node, ...nodes[(index + 1) % nodes.length]]))
export function IntelligenceField({ controller }: { controller: RefObject<HeroController> }) {
  const nodeGroup = useRef<Group>(null)
  const lines = useRef<BufferGeometry>(null)
  useFrame(() => {
    if (!controller.current.active || document.hidden) return
    const progress = controller.current.stages.geometry
    if (lines.current) lines.current.setDrawRange(0, Math.floor(progress * nodes.length) * 2)
    nodeGroup.current?.children.forEach((node, index) => {
      const amount = Math.max(0, Math.min(1, progress * 1.5 - index * .05))
      node.scale.setScalar(amount)
    })
  })
  return <>
    {[0, 1, 2].map((index) => <mesh key={index} rotation={[0.35 + index * 0.55, index * 0.3, index * 0.45]}>
      <torusGeometry args={[2.5 + index * 0.25, 0.006, 5, 128]} />
      <meshStandardMaterial color={index === 2 ? '#8e86af' : '#abc2d4'} transparent opacity={0.3 - index * 0.065} metalness={0.55} roughness={0.4} />
    </mesh>)}
    <lineSegments>
      <bufferGeometry ref={lines}><bufferAttribute attach="attributes-position" args={[edges, 3]} /></bufferGeometry>
      <lineBasicMaterial color="#abc2d4" transparent opacity={0.23} />
    </lineSegments>
    <group ref={nodeGroup}>{nodes.map((position, index) => <mesh key={index} position={position}>
      <octahedronGeometry args={[index % 3 === 0 ? 0.046 : 0.028]} />
      <meshStandardMaterial color="#abc2d4" emissive="#abc2d4" emissiveIntensity={0.45} metalness={0.4} roughness={0.3} />
    </mesh>)}</group>
    {[[-2.3, -0.8, -0.8], [2.3, 0.5, -1.1]].map(([x, y, z], index) => <mesh key={index} position={[x, y, z]} rotation={[0.1, index ? -0.4 : 0.4, -0.12]}>
      <planeGeometry args={[0.75, 1.1]} />
      <meshStandardMaterial color="#abc2d4" transparent opacity={0.035} metalness={0.7} roughness={0.15} depthWrite={false} />
    </mesh>)}
  </>
}
