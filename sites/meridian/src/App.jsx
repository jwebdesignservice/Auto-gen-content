import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './components/Scene'
import Content from './components/Content'
import Preloader from './components/Preloader'
import Logo from './components/Logo'
import { scrollState } from './lib/scroll'
import { splitText } from './lib/split'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const lenisRef = useRef(null)
  const heroIntroRef = useRef(null)
  const startRef = useRef(null)
  const revealedRef = useRef(false)
  const flags = useRef({ setupDone: false, doneCalled: false })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    let teardown = () => {}

    const run = () => {
      const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 })
      lenisRef.current = lenis
      lenis.stop()
      lenis.on('scroll', ScrollTrigger.update)
      lenis.on('scroll', ({ scroll, limit }) => {
        scrollState.progress = limit > 0 ? scroll / limit : 0
      })
      const tick = (t) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      const ctx = gsap.context(() => {
        const selector =
          '.content .eyebrow, .content .title, .content .body, .content .faq-item h3, .content .faq-item p, .content .stat-num, .content .stat-label, .content .cta, .footer span'
        const els = gsap.utils.toArray(selector)
        const heroSec = document.querySelector('.section.hero')

        els.forEach((el) => {
          const chars = splitText(el)
          if (heroSec && heroSec.contains(el)) {
            // hero is revealed by a CSS class toggle (see below) — no gsap here
            return
          }
          // everything else: scroll-scrubbed letter-by-letter reveal
          gsap.set(chars, { opacity: 0.14 })
          gsap.to(chars, {
            opacity: 1,
            ease: 'none',
            stagger: { amount: 0.9 },
            scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 42%', scrub: 0.5 },
          })
        })

        // stagger the hero letters via CSS transition-delay (in reading order)
        if (heroSec) {
          heroSec.querySelectorAll('.char').forEach((c, i) => {
            c.style.transitionDelay = Math.min(i * 0.005, 0.65) + 's'
          })
        }

        // reveal = add a class; CSS transitions handle the letter-by-letter cascade,
        // independent of the gsap ticker so it can never get stuck hidden
        heroIntroRef.current = () => {
          if (revealedRef.current || !heroSec) return
          revealedRef.current = true
          heroSec.classList.add('revealed')
        }
      })

      ScrollTrigger.refresh()

      startRef.current = () => {
        lenis.start()
        heroIntroRef.current && heroIntroRef.current()
      }
      flags.current.setupDone = true
      if (flags.current.doneCalled) startRef.current()

      teardown = () => {
        ctx.revert()
        gsap.ticker.remove(tick)
        lenis.destroy()
        ScrollTrigger.getAll().forEach((t) => t.kill())
      }
    }

    // run setup once fonts are ready, but never wait more than 1.5s for them
    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()
    Promise.race([ready, new Promise((r) => setTimeout(r, 1500))]).then(run)

    return () => teardown()
  }, [])

  const handleDone = () => {
    if (flags.current.doneCalled) return
    setLoaded(true)
    flags.current.doneCalled = true
    if (flags.current.setupDone && startRef.current) startRef.current()
  }

  // ultimate safety: after the animation should have finished, force the hero
  // text to its final state instantly (transition off) so it can NEVER stay
  // hidden — even if the tab was backgrounded and every animation was frozen.
  useEffect(() => {
    const t = setTimeout(() => {
      handleDone()
      const hero = document.querySelector('.section.hero')
      if (hero) {
        hero.classList.add('revealed')
        hero.querySelectorAll('.char').forEach((c) => {
          c.style.transition = 'none'
          c.style.opacity = '1'
          c.style.transform = 'none'
        })
      }
      revealedRef.current = true
    }, 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {!loaded && <Preloader onDone={handleDone} />}

      <div className="bg-layer" />
      {/*
        ASSET 01 slot — Higgsfield ambient background loop.
        Drop the file at /public/hero-loop.mp4 and uncomment:
        <video className="bg-video" autoPlay muted loop playsInline src="/hero-loop.mp4" />
      */}
      <Scene />
      <div className="scrim" />

      <nav className="nav">
        <div className="brand">
          <Logo className="logo" />
          <span className="brand-word">Meridian</span>
        </div>
        <div className="nav-links">
          <a href="#">NETWORK</a>
          <a href="#">DOCS</a>
          <a href="#">PRICING</a>
          <button className="nav-cta">Get access</button>
        </div>
      </nav>

      <Content />
    </>
  )
}
