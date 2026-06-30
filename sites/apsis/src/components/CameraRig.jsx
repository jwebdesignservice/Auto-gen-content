import { useThree, useFrame } from '@react-three/fiber'
import { scrollState } from '../lib/scroll'

// Scroll choreographs a full camera journey: dolly into the crystal through the
// middle of the page, then pull back out for the closing sections.
export default function CameraRig() {
  const { camera } = useThree()
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const k = 1 - Math.exp(-d * 2.5)
    const p = scrollState.progress
    const targetZ = 5 - Math.sin(p * Math.PI) * 3.0 // in to ~2 at mid, back to 5
    const targetX = Math.sin(p * Math.PI * 2) * 0.9
    const targetY = Math.sin(p * Math.PI) * 0.45
    camera.position.z += (targetZ - camera.position.z) * k
    camera.position.x += (targetX - camera.position.x) * k
    camera.position.y += (targetY - camera.position.y) * k
    camera.lookAt(0, 0, 0)
  })
  return null
}
