// Shape target generators for the particle spine.
// Each returns a Float32Array of length n*3 (xyz per particle).
// The order of buildShapes() is the scroll storyboard.

const TAU = Math.PI * 2

function nebula(n) {
  const a = new Float32Array(n * 3)
  const R = 2.6
  for (let i = 0; i < n; i++) {
    const r = R * Math.cbrt(Math.random())
    const theta = Math.random() * TAU
    const phi = Math.acos(2 * Math.random() - 1)
    const s = Math.sin(phi)
    a[i * 3] = r * s * Math.cos(theta)
    a[i * 3 + 1] = r * s * Math.sin(theta) * 0.8
    a[i * 3 + 2] = r * Math.cos(phi)
  }
  return a
}

function globe(n) {
  const a = new Float32Array(n * 3)
  const R = 2.05
  const gold = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = gold * i
    a[i * 3] = Math.cos(theta) * rad * R
    a[i * 3 + 1] = y * R
    a[i * 3 + 2] = Math.sin(theta) * rad * R
  }
  return a
}

function starfield(n) {
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const r = 3 + Math.random() * 3.6
    const theta = Math.random() * TAU
    const phi = Math.acos(2 * Math.random() - 1)
    const s = Math.sin(phi)
    a[i * 3] = r * s * Math.cos(theta)
    a[i * 3 + 1] = r * s * Math.sin(theta)
    a[i * 3 + 2] = r * Math.cos(phi) - 1
  }
  return a
}

function torus(n) {
  const a = new Float32Array(n * 3)
  const R = 2.2
  const t = 0.62
  const tilt = 1.15
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  for (let i = 0; i < n; i++) {
    const u = Math.random() * TAU
    const v = Math.random() * TAU
    const x = (R + t * Math.cos(v)) * Math.cos(u)
    const y0 = (R + t * Math.cos(v)) * Math.sin(u)
    const z0 = t * Math.sin(v)
    a[i * 3] = x
    a[i * 3 + 1] = y0 * ct - z0 * st
    a[i * 3 + 2] = y0 * st + z0 * ct
  }
  return a
}

function coreSphere(n) {
  const a = new Float32Array(n * 3)
  const R = 1.5
  const gold = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = gold * i
    const jitter = 0.9 + Math.random() * 0.12
    a[i * 3] = Math.cos(theta) * rad * R * jitter
    a[i * 3 + 1] = y * R * jitter
    a[i * 3 + 2] = Math.sin(theta) * rad * R * jitter
  }
  return a
}

function spiral(n) {
  const a = new Float32Array(n * 3)
  const arms = 3
  const tilt = 1.05
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  for (let i = 0; i < n; i++) {
    const t = i / n
    const arm = i % arms
    const angle = t * Math.PI * 5 + (arm * TAU) / arms
    const rad = 0.3 + t * 3.0
    const x = Math.cos(angle) * rad + (Math.random() - 0.5) * 0.25
    const y0 = (Math.random() - 0.5) * 0.5
    const z0 = Math.sin(angle) * rad + (Math.random() - 0.5) * 0.25
    a[i * 3] = x
    a[i * 3 + 1] = y0 * ct - z0 * st
    a[i * 3 + 2] = y0 * st + z0 * ct
  }
  return a
}

export function buildShapes(n) {
  return [
    nebula(n), // hero
    globe(n), // value
    starfield(n), // problem (explode)
    torus(n), // shift
    coreSphere(n), // scale
    spiral(n), // faq
    starfield(n), // cta (disperse)
  ]
}

// Horizontal offset of the cluster per shape, so it sits opposite the text.
// Cluster sits opposite the text per section: + = cluster right (text left),
// - = cluster left (text right), 0 = centred.
export const SHAPE_OFFSETS = [1.4, 1.4, 0, -1.3, 1.3, -1.4, 0]
