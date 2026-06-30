import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Soft floating orbs in the active colorway's panel tint — slow drift,
// gentle scale breathing, and a smooth color lerp when the variant changes.
function Orbs({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null)
  const target = useMemo(() => new THREE.Color(color), [])

  const orbs = useMemo(
    () =>
      Array.from({ length: 6 }).map(() => ({
        pos: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 10,
          -2 - Math.random() * 8,
        ] as [number, number, number],
        r: 1.1 + Math.random() * 1.9,
        speed: 0.14 + Math.random() * 0.28,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.28,
      })),
    [],
  )

  useFrame((state) => {
    target.set(color)
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return
    g.children.forEach((child, i) => {
      const o = orbs[i]
      child.position.y = o.pos[1] + Math.sin(t * o.speed + o.phase) * 1.3
      child.position.x = o.pos[0] + Math.cos(t * o.speed * 0.7 + o.phase) * 1.0
      const s = 1 + Math.sin(t * o.speed * 1.2 + o.phase) * 0.06
      child.scale.setScalar(s)
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      if (mat && mat.color) mat.color.lerp(target, 0.04)
    })
  })

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={o.pos}>
          <sphereGeometry args={[o.r, 48, 48]} />
          <meshStandardMaterial
            color={color}
            roughness={0.65}
            metalness={0}
            transparent
            opacity={o.opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function Background3D({ color }: { color: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 6]} intensity={0.6} />
      <Orbs color={color} />
    </Canvas>
  )
}
