import { useEffect } from 'react'
import Lenis from 'lenis'
import Hero from './Hero'
import Sections from './Sections'

export default function App() {
  // smooth momentum scroll (driven via rAF — never init Lenis without this)
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="bg-[#0C0C0C]">
      <Hero />
      <Sections />
    </div>
  )
}
