import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './components/Scene'
import Content from './components/Content'
import { scrollState } from './lib/scroll'

// wrap each word in a masked span pair for a reveal-from-below effect
function splitWords(el) {
  const text = el.textContent
  el.textContent = ''
  const inners = []
  text.split(/(\s+)/).forEach((part) => {
    if (part.trim() === '') {
      el.appendChild(document.createTextNode(part))
      return
    }
    const w = document.createElement('span')
    w.className = 'w'
    const wi = document.createElement('span')
    wi.className = 'wi'
    wi.textContent = part
    w.appendChild(wi)
    el.appendChild(w)
    inners.push(wi)
  })
  return inners
}

export default function App() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', ({ scroll, limit }) => {
      scrollState.progress = limit > 0 ? scroll / limit : 0
    })
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      // headline word-mask reveals
      gsap.utils.toArray('.fx-words').forEach((el) => {
        const words = splitWords(el)
        gsap.from(words, {
          yPercent: 120,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })

      // simple fade-up
      gsap.utils.toArray('.fx-up').forEach((el) => {
        gsap.from(el, {
          y: 38,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })

      // staggered groups
      gsap.utils.toArray('.fx-stagger').forEach((group) => {
        gsap.from(group.children, {
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 84%' },
        })
      })

      // count-up numbers
      gsap.utils.toArray('.count').forEach((el) => {
        const end = parseFloat(el.dataset.count)
        const suffix = el.dataset.suffix || ''
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            el.textContent = Math.round(obj.v) + suffix
          },
        })
      })

      // pinned horizontal process
      const track = document.querySelector('.process-track')
      if (track) {
        const panels = track.children.length
        gsap.to(track, {
          xPercent: -100 * (panels - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: '.process',
            start: 'top top',
            end: () => '+=' + track.scrollWidth,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      }
    })

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <div className="page-bg" />
      <Scene />

      <nav className="nav glass">
        <span className="brand">APSIS</span>
        <div className="nav-links">
          <a href="#">STUDIO</a>
          <a href="#">WORK</a>
          <a href="#">CONTACT</a>
        </div>
        <button className="nav-cta">Start a project</button>
      </nav>

      <Content />
    </>
  )
}
