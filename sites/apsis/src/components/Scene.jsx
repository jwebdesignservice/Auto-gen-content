import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Crystal from './Crystal'
import CameraRig from './CameraRig'

export default function Scene() {
  return (
    <div className="canvas-wrap">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <CameraRig />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 4, 5]} intensity={1.0} />
        <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#8ec5ff" />

        <Suspense fallback={null}>
          <Crystal />
          <Sparkles count={70} scale={[14, 14, 6]} size={2.4} speed={0.3} opacity={0.6} color="#cdbfff" />
          {/* spectral environment for refraction/reflection (no external HDRI) */}
          <Environment resolution={256}>
            <Lightformer form="ring" intensity={2.4} color="#ffe6c0" position={[0, 0, -5]} scale={6} />
            <Lightformer form="rect" intensity={2.2} color="#8ec5ff" position={[-5, 2, -2]} scale={[3, 6, 1]} />
            <Lightformer form="rect" intensity={2.2} color="#ff9ed8" position={[5, -2, -2]} scale={[3, 6, 1]} />
            <Lightformer form="circle" intensity={1.6} color="#ffffff" position={[0, 4, 3]} scale={3} />
          </Environment>
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom mipmapBlur luminanceThreshold={0.55} intensity={1.15} radius={0.75} />
          <Vignette offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
