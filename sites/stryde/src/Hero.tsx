import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Background3D from './Background3D'

const IMAGES = [
  { src: '/1.png', bg: '#E8623C', panel: '#F0805C' }, // Ember
  { src: '/2.png', bg: '#2FA36B', panel: '#46B981' }, // Pine
  { src: '/3.png', bg: '#D6589E', panel: '#E27CB6' }, // Bloom
  { src: '/4.png', bg: '#3B7DE0', panel: '#5E97EE' }, // Cobalt
]

const EASE = 'cubic-bezier(0.4,0,0.2,1)'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")"

const TRANSITION = [
  `transform 650ms ${EASE}`,
  `filter 650ms ${EASE}`,
  `opacity 650ms ${EASE}`,
  `left 650ms ${EASE}`,
  `bottom 650ms ${EASE}`,
  `height 650ms ${EASE}`,
].join(', ')

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  )
  const animatingRef = useRef(false)

  useEffect(() => {
    IMAGES.forEach((i) => {
      const img = new Image()
      img.src = i.src
    })
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navigate = (dir: 'next' | 'prev') => {
    if (animatingRef.current) return
    animatingRef.current = true
    setIsAnimating(true)
    setActiveIndex((prev) => (dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4))
    window.setTimeout(() => {
      animatingRef.current = false
      setIsAnimating(false)
    }, 650)
  }

  const center = activeIndex

  const itemStyle = (i: number): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      aspectRatio: '1.45 / 1',
      transformOrigin: 'bottom center',
      transition: TRANSITION,
      willChange: 'transform, filter, opacity',
    }
    const left = (activeIndex + 3) % 4
    const right = (activeIndex + 1) % 4
    if (i === center) {
      return {
        ...base,
        left: '50%',
        bottom: isMobile ? '8%' : '7%',
        height: isMobile ? '40%' : '66%',
        transform: `translateX(-50%) scale(${isMobile ? 1 : 1.08})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
      }
    }
    if (i === left) {
      return {
        ...base,
        left: isMobile ? '17%' : '27%',
        bottom: isMobile ? '40%' : '33%',
        height: isMobile ? '13%' : '22%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
      }
    }
    if (i === right) {
      return {
        ...base,
        left: isMobile ? '83%' : '73%',
        bottom: isMobile ? '40%' : '33%',
        height: isMobile ? '13%' : '22%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
      }
    }
    return {
      ...base,
      left: '50%',
      bottom: isMobile ? '42%' : '37%',
      height: isMobile ? '10%' : '16%',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(4px)',
      opacity: 1,
      zIndex: 5,
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: `background-color 650ms ${EASE}`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <Background3D color={IMAGES[activeIndex].panel} />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: GRAIN,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 2, top: '18%' }}
        >
          <span
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(76px, 22vw, 300px)',
              fontWeight: 900,
              color: '#fff',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            AERO
          </span>
        </div>

        <div className="absolute top-6 left-4 sm:left-8" style={{ zIndex: 60 }}>
          <span
            className="text-xs font-semibold uppercase"
            style={{ color: '#fff', opacity: 0.9, letterSpacing: '0.18em' }}
          >
            STRYDE
          </span>
        </div>

        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((im, i) => (
            <div key={i} style={itemStyle(i)}>
              <img
                src={im.src}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <p
            className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px]"
            style={{ color: '#fff', opacity: 0.95, letterSpacing: '0.02em' }}
          >
            STRYDE AERO
          </p>
          <p
            className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
            style={{ color: '#fff', opacity: 0.85, lineHeight: 1.6 }}
          >
            Featherlight, responsive, and built to go the distance. The fit is dialed, the energy
            return is real, and it looks this good in every colorway. Lace up. Order now.
          </p>
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => navigate('prev')}
              aria-label="Previous"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'transparent',
                border: '2px solid #fff',
                color: '#fff',
                transition: 'transform 150ms, background-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)'
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              aria-label="Next"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'transparent',
                border: '2px solid #fff',
                color: '#fff',
                transition: 'transform 150ms, background-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)'
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10" style={{ zIndex: 60 }}>
          <a
            href="#"
            className="flex items-center"
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              color: '#fff',
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.95'
            }}
          >
            GET YOURS
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </div>
  )
}
