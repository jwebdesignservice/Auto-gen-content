import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { scrollState } from '../lib/scroll'

// The hero: a faceted glass crystal that refracts the environment and
// disperses light into spectrum (chromaticAberration).
export default function Crystal() {
  const ref = useRef()

  useFrame((state, delta) => {
    if (!ref.current) return
    const d = Math.min(delta, 0.05)
    const r = ref.current
    r.rotation.y += d * 0.16
    r.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.18
    // grows a touch as the camera dives in
    const target = 1 + scrollState.progress * 0.5
    r.scale.x += (target - r.scale.x) * (1 - Math.exp(-d * 3))
    r.scale.y = r.scale.z = r.scale.x
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.3, 0]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        thickness={1.5}
        roughness={0.05}
        transmission={1}
        ior={1.62}
        chromaticAberration={0.85}
        anisotropy={0.4}
        distortion={0.3}
        distortionScale={0.4}
        temporalDistortion={0.08}
        clearcoat={1}
        clearcoatRoughness={0.1}
        color="#ffffff"
      />
    </mesh>
  )
}
