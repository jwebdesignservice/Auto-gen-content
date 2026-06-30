import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Logo from './Logo'

const COLS = 6

export default function Preloader({ onDone }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => onDone && onDone() })
      tl.set('.pl-fill', { width: '0%' })
        .to('.pl-fill', { width: '100%', duration: 0.9, ease: 'power2.inOut' })
        .to('.pl-center', { opacity: 0, duration: 0.25, ease: 'power1.out' })
        .to(
          '.pl-col',
          { yPercent: -100, duration: 0.6, stagger: 0.07, ease: 'power3.inOut' },
          '-=0.05'
        )
    }, root)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="preloader" ref={root}>
      <div className="pl-cols">
        {Array.from({ length: COLS }).map((_, i) => (
          <div className="pl-col" key={i} />
        ))}
      </div>
      <div className="pl-center">
        <Logo className="pl-logo" />
        <div className="pl-label">MERIDIAN</div>
        <div className="pl-track">
          <div className="pl-fill" />
        </div>
      </div>
    </div>
  )
}
