import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'

export default function Scene() {
  // Dev-only freeze toggle. Switching to "demand" stops the rAF loop so the
  // page can stabilise for screenshots. window.__freeze(true|false)
  const [loop, setLoop] = useState('always')
  useEffect(() => {
    window.__freeze = (v) => setLoop(v ? 'demand' : 'always')
    return () => {
      delete window.__freeze
    }
  }, [])

  return (
    <div className="canvas-wrap">
      <Canvas
        frameloop={loop}
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ParticleField />
      </Canvas>
    </div>
  )
}
