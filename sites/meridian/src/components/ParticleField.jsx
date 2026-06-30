import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildShapes, SHAPE_OFFSETS } from '../lib/shapes'
import { scrollState } from '../lib/scroll'

const N = 14000

function makeDotTexture() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  return tex
}

// Brand palette: mostly violet/indigo, some white, a few gold flecks.
const PALETTE = [
  [0.486, 0.361, 1.0], // violet
  [0.27, 0.22, 0.78], // indigo
  [1.0, 1.0, 1.0], // white
  [0.95, 0.76, 0.31], // gold
]

export default function ParticleField() {
  const ref = useRef()
  const { shapes, colors, current, texture } = useMemo(() => {
    const shapes = buildShapes(N)
    const colors = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const roll = Math.random()
      let c
      if (roll < 0.5) c = PALETTE[0]
      else if (roll < 0.68) c = PALETTE[1]
      else if (roll < 0.86) c = PALETTE[2]
      else c = PALETTE[3]
      const v = 0.7 + Math.random() * 0.3
      colors[i * 3] = c[0] * v
      colors[i * 3 + 1] = c[1] * v
      colors[i * 3 + 2] = c[2] * v
    }
    const current = shapes[0].slice()
    return { shapes, colors, current, texture: makeDotTexture() }
  }, [])

  const { camera } = useThree()

  useFrame((state, delta) => {
    if (!ref.current) return
    const d = Math.min(delta, 0.05)
    const p = scrollState.progress
    const segCount = shapes.length - 1
    const seg = Math.min(p * segCount, segCount)
    let i0 = Math.floor(seg)
    if (i0 > segCount - 1) i0 = segCount - 1
    const lt = seg - i0
    const t = lt * lt * (3 - 2 * lt) // smoothstep
    const a = shapes[i0]
    const b = shapes[i0 + 1]
    const ox = SHAPE_OFFSETS[i0] + (SHAPE_OFFSETS[i0 + 1] - SHAPE_OFFSETS[i0]) * t

    const k = 1 - Math.exp(-d * 3.5) // frame-rate independent smoothing
    const time = state.clock.elapsedTime
    const arr = ref.current.geometry.attributes.position.array

    for (let i = 0; i < N; i++) {
      const ix = i * 3
      const tx = a[ix] + (b[ix] - a[ix]) * t
      const ty = a[ix + 1] + (b[ix + 1] - a[ix + 1]) * t
      const tz = a[ix + 2] + (b[ix + 2] - a[ix + 2]) * t
      const ph = i * 0.7
      const driftX = Math.sin(time * 0.4 + ph) * 0.03
      const driftY = Math.cos(time * 0.35 + ph) * 0.03
      const driftZ = Math.sin(time * 0.3 + ph * 1.3) * 0.03
      arr[ix] += (tx + driftX - arr[ix]) * k
      arr[ix + 1] += (ty + driftY - arr[ix + 1]) * k
      arr[ix + 2] += (tz + driftZ - arr[ix + 2]) * k
    }
    ref.current.geometry.attributes.position.needsUpdate = true

    ref.current.position.x += (ox - ref.current.position.x) * k
    ref.current.rotation.y += d * 0.025

    camera.position.z += (6 - p * 0.7 - camera.position.z) * k
    camera.position.y += (p * 0.3 - camera.position.y) * k
    camera.lookAt(0, 0, 0)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={current} count={N} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={N} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        map={texture}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
