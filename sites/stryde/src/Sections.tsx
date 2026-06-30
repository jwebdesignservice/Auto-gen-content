import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import type { MotionValue } from 'framer-motion'
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion'
import { ArrowUpRight, Feather, Zap, Footprints, Target, Recycle } from 'lucide-react'

const DISPLAY: React.CSSProperties = { fontFamily: 'Anton, sans-serif' }
const SPECTRUM = 'linear-gradient(90deg,#E8623C,#F0805C,#ff9ed8,#9ec5ff)'

/* ---------- helpers ---------- */

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setVal(v) })
    return () => controls.stop()
  }, [inView, to])
  return (
    <span ref={ref}>
      {Math.round(val)}
      {suffix}
    </span>
  )
}

function Char({ ch, range, progress }: { ch: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return <motion.span style={{ opacity }}>{ch}</motion.span>
}

function AnimatedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })
  const chars = text.split('')
  return (
    <p ref={ref} className={className} style={{ position: 'relative' }}>
      {chars.map((c, i) => (
        <Char key={i} ch={c} range={[i / chars.length, (i + 1) / chars.length]} progress={scrollYProgress} />
      ))}
    </p>
  )
}

/* ---------- decor: colour wash + animated concept shapes ---------- */

function AmbientBackground() {
  const blobs = [
    { c: '#E8623C', top: '3%', left: '-10%' },
    { c: '#6EB5FF', top: '26%', right: '-12%' },
    { c: '#46B981', top: '50%', left: '-8%' },
    { c: '#E882B4', top: '72%', right: '-10%' },
    { c: '#F2C14E', top: '88%', left: '8%' },
  ] as { c: string; top: string; left?: string; right?: string }[]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '48vw',
            height: '48vw',
            top: b.top,
            left: b.left,
            right: b.right,
            background: `radial-gradient(circle, ${b.c}22, transparent 60%)`,
            filter: 'blur(70px)',
          }}
          animate={{ x: [0, i % 2 ? 50 : -50, 0], y: [0, 34, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 16 + i * 3, ease: 'easeInOut', repeat: Infinity }}
        />
      ))}
    </div>
  )
}

function OrbitRings({
  className = '',
  color = '#F0805C',
  size = 460,
  dur = 60,
}: {
  className?: string
  color?: string
  size?: number
  dur?: number
}) {
  return (
    <motion.svg
      className={`absolute pointer-events-none ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ opacity: 0.22 }}
      animate={{ rotate: 360 }}
      transition={{ duration: dur, ease: 'linear', repeat: Infinity }}
    >
      <circle cx="100" cy="100" r="97" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="3 7" />
      <circle cx="100" cy="100" r="72" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="100" cy="100" r="46" fill="none" stroke={color} strokeWidth="0.4" strokeDasharray="2 5" />
      <circle cx="100" cy="3" r="2.4" fill={color} />
    </motion.svg>
  )
}

function SpeedStreaks({ className = '', color = '#6EB5FF' }: { className?: string; color?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} style={{ opacity: 0.3 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute h-[2px] rounded-full"
          style={{
            width: 90 + i * 36,
            top: i * 20,
            left: 0,
            rotate: '-18deg',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
          animate={{ x: ['-40%', '160%'] }}
          transition={{ duration: 2.6 + i * 0.5, ease: 'easeInOut', repeat: Infinity, delay: i * 0.35 }}
        />
      ))}
    </div>
  )
}

/* ---------- 1. Marquee ---------- */

const MARQUEE_TOP = ['/detail-pair.png', '/detail-knit.png', '/dark-hero.png', '/detail-sole.png', '/detail-heel.png', '/detail-outsole.png']
const MARQUEE_BOT = ['/cw-1.png', '/cw-2.png', '/cw-3.png', '/cw-4.png', '/cw-5.png', '/cw-6.png']

function MarqueeRow({ imgs, dir }: { imgs: string[]; dir: 1 | -1 }) {
  // duplicate exactly 2x so a -50% shift loops seamlessly and the row is always full
  const tiles = [...imgs, ...imgs]
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: dir === 1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
      >
        {tiles.map((src, i) => (
          <div
            key={i}
            className="h-[240px] w-[340px] sm:h-[340px] sm:w-[500px] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] shrink-0"
          >
            <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Marquee() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 flex flex-col gap-3"
      style={{ background: 'radial-gradient(120% 95% at 50% 0%, #242063 0%, #0c0c1a 72%)' }}
    >
      <OrbitRings className="-top-24 -left-24" size={360} color="#F2C14E" dur={50} />
      <MarqueeRow imgs={MARQUEE_TOP} dir={1} />
      <MarqueeRow imgs={MARQUEE_BOT} dir={-1} />
    </section>
  )
}

/* ---------- 2. Turntable (full-bleed scroll-scrubbed video) ---------- */

function Turntable() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let raf = 0
    let smooth = 0
    const loop = () => {
      const el = sectionRef.current
      const v = videoRef.current
      if (el && v && v.duration) {
        const rect = el.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0
        smooth += (p - smooth) * 0.1
        const t = Math.min(smooth, 0.999) * (v.duration - 0.05)
        if (Math.abs(v.currentTime - t) > 0.012) v.currentTime = t
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const v = videoRef.current
    if (v) v.play().then(() => v.pause()).catch(() => {})
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section ref={sectionRef} className="relative" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* full-width background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/turntable.mp4"
          poster="/dark-hero.png"
          muted
          playsInline
          preload="auto"
        />
        {/* blend the frame into the dark site, top + bottom */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0C0C0C] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/70 to-transparent pointer-events-none" />
        {/* readability scrim behind type */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(60% 50% at 50% 50%, rgba(12,12,12,0.55), transparent 70%)' }}
        />
        <OrbitRings className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={640} color="#F0805C" dur={48} />
        <div className="relative z-10 text-center px-6 pointer-events-none">
          <p className="text-xs uppercase tracking-[0.4em] text-white/55 mb-5">Engineered in the round</p>
          <h2 className="uppercase leading-[0.86] text-white" style={{ ...DISPLAY, fontSize: 'clamp(56px, 13vw, 230px)' }}>
            See every
            <br />
            angle.
          </h2>
        </div>
      </div>
    </section>
  )
}

/* ---------- 3. Manifesto (char reveal + corner images) ---------- */

function CornerImg({
  src,
  posClass,
  from,
  parallax,
}: {
  src: string
  posClass: string
  from: { x: number; y: number; rot: number; delay: number; rest: number }
  parallax: MotionValue<number>
}) {
  return (
    <motion.div
      className={`absolute ${posClass} w-[140px] sm:w-[230px] md:w-[320px] pointer-events-none`}
      style={{ y: parallax }}
    >
      <motion.img
        src={src}
        alt=""
        draggable={false}
        className="w-full rounded-3xl"
        style={{ filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.6))' }}
        initial={{ opacity: 0, x: from.x, y: from.y, rotate: from.rot }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: from.rest }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.22, 0.7, 0.2, 1], delay: from.delay }}
      />
    </motion.div>
  )
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const pUp = useTransform(scrollYProgress, [0, 1], [70, -70])
  const pDown = useTransform(scrollYProgress, [0, 1], [-70, 70])
  return (
    <section
      ref={ref}
      className="relative py-36 md:py-56 px-6 flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(120% 120% at 50% 38%, #ffa176 0%, #ec6a40 52%, #c8492a 100%)' }}
    >
      <OrbitRings className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={680} color="#3a1408" dur={72} />
      <CornerImg src="/cw-1.png" posClass="top-6 left-3 sm:top-12 sm:left-12" from={{ x: -90, y: -50, rot: -16, delay: 0, rest: -7 }} parallax={pUp} />
      <CornerImg src="/cw-4.png" posClass="top-6 right-3 sm:top-12 sm:right-12" from={{ x: 90, y: -50, rot: 16, delay: 0.1, rest: 7 }} parallax={pUp} />
      <CornerImg src="/cw-2.png" posClass="bottom-6 left-3 sm:bottom-12 sm:left-12" from={{ x: -90, y: 50, rot: 14, delay: 0.2, rest: 6 }} parallax={pDown} />
      <CornerImg src="/cw-3.png" posClass="bottom-6 right-3 sm:bottom-12 sm:right-12" from={{ x: 90, y: 50, rot: -14, delay: 0.3, rest: -6 }} parallax={pDown} />
      <AnimatedText
        className="relative z-10 max-w-[15ch] text-center text-[#2a0f06] font-bold leading-[1.05] text-[clamp(1.9rem,5.5vw,5rem)]"
        text="Less shoe. More go. Built for runners who never settle."
      />
    </section>
  )
}

/* ---------- 4. Features (full-width, rise-mask reveal) ---------- */

const FEATURES = [
  { n: '01', t: 'Featherweight knit', d: 'A one-piece engineered upper that wraps the foot and breathes on every mile.', Icon: Feather, color: '#F0805C' },
  { n: '02', t: 'Energy-return foam', d: 'A supercritical midsole that gives back what you put in, stride after stride.', Icon: Zap, color: '#F2C14E' },
  { n: '03', t: 'Grip that holds', d: 'A translucent rubber outsole tuned for road, track, and everything between.', Icon: Footprints, color: '#46B981' },
  { n: '04', t: 'Dialed-in fit', d: 'A sculpted heel and locked midfoot so nothing moves but you.', Icon: Target, color: '#6EB5FF' },
  { n: '05', t: 'Made to last', d: 'Recycled yarns and durable construction, designed to outrun the season.', Icon: Recycle, color: '#E882B4' },
]

function FeatureRow({ f, i }: { f: (typeof FEATURES)[number]; i: number }) {
  const { n, t, d, Icon, color } = f
  return (
    <motion.div
      initial={{ opacity: 0, x: -110 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.22, 0.7, 0.2, 1], delay: i * 0.08 }}
      className="group grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-12 items-center py-8 md:py-12 border-t border-white/10"
    >
      <div className="flex items-center gap-4 md:gap-7">
        <div
          className="flex items-center justify-center rounded-2xl shrink-0 w-14 h-14 md:w-20 md:h-20 transition-all duration-500 group-hover:scale-110"
          style={{ backgroundColor: `${color}1f`, border: `1px solid ${color}44` }}
        >
          <Icon className="w-6 h-6 md:w-9 md:h-9" style={{ color }} strokeWidth={2} />
        </div>
        <span
          className="leading-none transition-opacity duration-500 opacity-80 group-hover:opacity-100 hidden sm:block"
          style={{ ...DISPLAY, fontSize: 'clamp(40px, 6vw, 110px)', color }}
        >
          {n}
        </span>
      </div>
      <div className="transition-transform duration-500 group-hover:translate-x-2 md:group-hover:translate-x-5">
        <h3 className="uppercase text-white tracking-wide leading-[0.95]" style={{ ...DISPLAY, fontSize: 'clamp(24px, 4.5vw, 72px)' }}>
          {t}
        </h3>
        <span
          className="block h-[3px] rounded-full mt-3 w-0 group-hover:w-16 transition-all duration-500"
          style={{ backgroundColor: color }}
        />
        <p className="mt-3 text-white/55 font-light max-w-2xl text-sm md:text-lg leading-relaxed">{d}</p>
      </div>
    </motion.div>
  )
}

function Features() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-36 px-6 md:px-12 w-full"
      style={{ background: 'radial-gradient(120% 95% at 50% 0%, #18563d 0%, #0a1712 74%)' }}
    >
      <OrbitRings className="-top-28 -right-28" size={460} color="#9cffe0" dur={58} />
      <motion.h2
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.22, 0.7, 0.2, 1] }}
        className="uppercase leading-none text-white mb-10 md:mb-16"
        style={{ ...DISPLAY, fontSize: 'clamp(52px, 12vw, 200px)' }}
      >
        Built different.
      </motion.h2>
      <div>
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.n} f={f} i={i} />
        ))}
      </div>
    </section>
  )
}

/* ---------- 5. Specs (full-width, blur-in + gradient sweep) ---------- */

const STATS: [number, string, string][] = [
  [198, 'g', 'Featherweight'],
  [8, 'mm', 'Heel-to-toe drop'],
  [92, '%', 'Energy return'],
  [100, '%', 'Recycled knit'],
]

function StatCell({ v, s, l, i }: { v: number; s: string; l: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 0.7, 0.2, 1], delay: i * 0.12 }}
      className="flex flex-col items-center"
    >
      <span
        className="leading-none"
        style={{
          ...DISPLAY,
          fontSize: 'clamp(48px, 8vw, 132px)',
          backgroundImage: SPECTRUM,
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        <Counter to={v} suffix={s} />
      </span>
      <motion.span
        className="block h-[3px] rounded-full mt-4"
        style={{ backgroundImage: SPECTRUM }}
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: i * 0.12 + 0.3 }}
      />
      <span className="mt-4 text-xs md:text-sm uppercase tracking-[0.22em] text-white/55">{l}</span>
    </motion.div>
  )
}

function Specs() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-36 px-6 md:px-12 border-y border-white/10 w-full"
      style={{ background: 'radial-gradient(120% 95% at 50% 0%, #1c3a86 0%, #0a1124 74%)' }}
    >
      <SpeedStreaks className="top-16 right-10 w-[320px] h-[140px]" color="#aed0ff" />
      <OrbitRings className="-bottom-24 -left-24" size={360} color="#E882B4" dur={54} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 0.7, 0.2, 1] }}
        className="mb-16 md:mb-24"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-white/45 mb-4">By the numbers</p>
        <h2 className="uppercase leading-none text-white" style={{ ...DISPLAY, fontSize: 'clamp(52px, 12vw, 200px)' }}>
          The spec sheet.
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-20 gap-x-10 md:gap-x-20 w-full">
        {STATS.map(([v, s, l], i) => (
          <StatCell key={l} v={v} s={s} l={l} i={i} />
        ))}
      </div>
    </section>
  )
}

/* ---------- 6. Colorways (full-width sticky-stack) ---------- */

const COLORWAYS = [
  { name: 'Ember', tag: 'Coral / Cream', src: '/1.png', bg: '#E8623C' },
  { name: 'Pine', tag: 'Forest / Cream', src: '/2.png', bg: '#2FA36B' },
  { name: 'Bloom', tag: 'Magenta / Cream', src: '/3.png', bg: '#D6589E' },
  { name: 'Cobalt', tag: 'Blue / Cream', src: '/4.png', bg: '#3B7DE0' },
]

function ColorwayCard({
  c,
  i,
  total,
  progress,
}: {
  c: (typeof COLORWAYS)[number]
  i: number
  total: number
  progress: MotionValue<number>
}) {
  const targetScale = 1 - (total - 1 - i) * 0.05
  const scale = useTransform(progress, [i / total, 1], [1, targetScale])
  return (
    <div className="sticky top-0 h-screen flex items-center justify-center">
      <motion.div
        style={{ scale, backgroundColor: c.bg, top: `${i * 26}px` }}
        className="relative w-[94vw] max-w-[1500px] h-[80vh] rounded-[36px] overflow-hidden flex items-center justify-between px-8 sm:px-16"
      >
        <div className="z-10">
          <span className="text-white/80 uppercase tracking-[0.22em] text-xs sm:text-sm">{c.tag}</span>
          <h3 className="text-white uppercase leading-none mt-3" style={{ ...DISPLAY, fontSize: 'clamp(56px, 11vw, 200px)' }}>
            {c.name}
          </h3>
        </div>
        <img
          src={c.src}
          alt={c.name}
          className="absolute right-[-4%] bottom-[-8%] w-[64%] max-w-[820px] object-contain drop-shadow-2xl"
        />
      </motion.div>
    </div>
  )
}

function Colorways() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section
      className="relative py-24 md:py-32"
      style={{ background: 'radial-gradient(120% 95% at 50% 0%, #4b1f56 0%, #160a18 74%)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <OrbitRings className="-top-20 right-6" size={380} color="#f0a8ff" dur={56} />
      </div>
      <div className="px-6 md:px-12 mb-8 w-full">
        <p className="text-xs uppercase tracking-[0.4em] text-white/45 mb-4">Four ways to run</p>
        <h2 className="uppercase leading-none text-white" style={{ ...DISPLAY, fontSize: 'clamp(52px, 13vw, 220px)' }}>
          Pick your colorway.
        </h2>
      </div>
      <div ref={ref} className="relative">
        {COLORWAYS.map((c, i) => (
          <ColorwayCard key={c.name} c={c} i={i} total={COLORWAYS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}

/* ---------- 7. Footer CTA (redesigned) ---------- */

const TICKER_ITEMS = ['Free shipping', '30-day returns', 'Carbon neutral', 'Lifetime support']

function Ticker() {
  return (
    <div className="relative border-y border-white/10 overflow-hidden py-4 md:py-5">
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
      >
        {Array.from({ length: 2 }).map((_, k) => (
          <span key={k} className="flex">
            {Array.from({ length: 4 }).map((_, g) =>
              TICKER_ITEMS.map((it) => (
                <span
                  key={`${k}-${g}-${it}`}
                  className="flex items-center text-white/55 uppercase tracking-[0.25em] text-xs md:text-sm"
                >
                  <span className="px-6">{it}</span>
                  <span className="text-white/25">/</span>
                </span>
              )),
            )}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function GlowField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          left: '-12%',
          top: '6%',
          background: 'radial-gradient(circle, rgba(232,98,60,0.20), transparent 62%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: ['0%', '14%', '0%'], y: ['0%', '8%', '0%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '52vw',
          height: '52vw',
          right: '-10%',
          bottom: '2%',
          background: 'radial-gradient(circle, rgba(110,181,255,0.16), transparent 62%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: ['0%', '-12%', '0%'], y: ['0%', '-8%', '0%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function FloatingShoe() {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const onMove = (e: ReactMouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    setTilt({ rx: -py * 9, ry: px * 12 })
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      className="relative mb-10 flex items-center justify-center"
      style={{ perspective: 1000 }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 420,
          height: 420,
          maxWidth: '88vw',
          background: 'radial-gradient(circle, rgba(232,98,60,0.45), transparent 62%)',
          filter: 'blur(55px)',
        }}
      />
      <motion.img
        src="/1.png"
        alt="STRYDE AERO"
        draggable={false}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        className="relative w-[300px] sm:w-[440px] md:w-[520px] object-contain"
        style={{
          transformStyle: 'preserve-3d',
          animation: 'floaty 6s ease-in-out infinite',
          filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.5))',
        }}
      />
    </div>
  )
}

function MagneticButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const onMove = (e: ReactMouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPos({ x: (e.clientX - (r.left + r.width / 2)) * 0.35, y: (e.clientY - (r.top + r.height / 2)) * 0.35 })
  }
  return (
    <motion.a
      ref={ref}
      href="#"
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="group relative inline-flex p-[2px] rounded-full"
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundImage: SPECTRUM }}
      />
      <span className="relative inline-flex items-center gap-2 rounded-full bg-white text-black font-semibold text-sm md:text-base px-9 py-4">
        {children}
        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.25} />
      </span>
    </motion.a>
  )
}

function FooterCTA() {
  return (
    <footer className="relative overflow-hidden">
      <Ticker />
      <div className="relative">
        <GlowField />
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 md:pt-28">
          <FloatingShoe />
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 0.7, 0.2, 1] }}
            className="uppercase leading-[0.9] text-white mb-8"
            style={{ ...DISPLAY, fontSize: 'clamp(48px, 9vw, 150px)' }}
          >
            Ready to run?
          </motion.h2>
          <MagneticButton>Shop STRYDE AERO</MagneticButton>
          <div className="mt-6 flex items-center gap-2 text-white/50 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            In stock, ships free
          </div>
        </div>

        <div className="relative overflow-hidden mt-10 md:mt-16">
          <motion.h3
            initial={{ y: '24%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: [0.22, 0.7, 0.2, 1] }}
            className="text-center uppercase leading-[0.8] select-none"
            style={{
              ...DISPLAY,
              fontSize: 'clamp(90px, 25vw, 440px)',
              backgroundImage: 'linear-gradient(180deg, #3c3c40 0%, #0c0c0c 92%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            STRYDE
          </motion.h3>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-12 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs uppercase tracking-[0.14em] border-t border-white/10 pt-6">
        <div className="flex gap-5">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
          <a href="#" className="hover:text-white transition-colors">Returns</a>
        </div>
        <span>© STRYDE. Reference build.</span>
      </div>
    </footer>
  )
}

/* ---------- export ---------- */

export default function Sections() {
  return (
    <div className="bg-[#08080c]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Marquee />
      <Turntable />
      <Manifesto />
      <Features />
      <Specs />
      <Colorways />
      <FooterCTA />
    </div>
  )
}
