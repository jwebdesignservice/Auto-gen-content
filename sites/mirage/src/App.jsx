import { useEffect, useRef, useState } from 'react'
import Content from './components/Content'

// Scroll fraction (0..1) at which each section becomes "active" (text reveals).
const SECTION_POINTS = [0, 0.24, 0.46, 0.64, 0.84]

export default function App() {
  const videoRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let smooth = 0
    let raf

    const sections = Array.from(document.querySelectorAll('.scene'))

    const loop = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      smooth += (p - smooth) * 0.1

      const v = videoRef.current
      if (v && v.duration) {
        const seekable = v.duration - 0.05
        const t = Math.min(smooth, 0.999) * seekable
        if (Math.abs(v.currentTime - t) > 0.012) v.currentTime = t
      }

      sections.forEach((el, i) => {
        if (smooth >= SECTION_POINTS[i] - 0.001) el.classList.add('active')
        else el.classList.remove('active')
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // reveal once the film can play (or after a short fallback)
    const reveal = () => setLoaded(true)
    const v = videoRef.current
    if (v) {
      v.addEventListener('canplaythrough', reveal, { once: true })
      // prime decoding so seeking is smooth (muted autoplay is allowed)
      v.play().then(() => v.pause()).catch(() => {})
    }
    const fallback = setTimeout(reveal, 3500)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(fallback)
    }
  }, [])

  return (
    <>
      <div className="stage">
        <video
          ref={videoRef}
          className="film"
          src="/mirage.mp4"
          muted
          playsInline
          preload="auto"
        />
        <div className="stage-tint" />
        <div className="stage-vignette" />
      </div>

      <nav className="nav">
        <span className="wordmark">MIRAGE</span>
        <span className="nav-tag">EAU DE PARFUM</span>
      </nav>

      <Content />

      <div className={`preloader ${loaded ? 'done' : ''}`}>
        <div className="pl-word">MIRAGE</div>
        <div className="pl-line" />
      </div>
    </>
  )
}
