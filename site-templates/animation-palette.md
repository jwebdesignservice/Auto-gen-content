# Animation Palette — reusable scroll/3D effects for product sites

The library of animations we've built and proven across builds (Meridian, MIRAGE, APSIS,
STRYDE). Pick a small, coherent subset per site. Each entry notes what it is, the tech, and
how it maps to a product/concept. Keep it credit-light: most of these are code, not generated
media. Generated media (Higgsfield) is only for the product itself and ambient textures.

## Scroll-driven / immersive
- **Scroll-scrubbed video** — a video's `currentTime` is driven by scroll (rAF + smoothing).
  Encode the MP4 all-keyframe (`ffmpeg -g 1`) for smooth seeking. Use native scroll, not Lenis-
  hijack-without-raf. Product use: a 360 turntable of the product, or a cinematic film. (MIRAGE, STRYDE turntable)
- **Scroll-scrubbed 3D camera** — camera dollies/orbits through a real-time scene as you scroll
  (r3f + a scrollState read in useFrame). Product use: fly around / into a hero object. (APSIS)
- **Particle morph spine** — one persistent WebGL particle system (~14k pts) whose target
  positions lerp between shapes across scroll; never cuts. Product use: brand object that
  transforms (cloud→brain→sphere). (Meridian)
- **Pinned section** — GSAP ScrollTrigger `pin` holds a section while content advances
  (horizontal pan, step reveal). Product use: process steps, feature walkthrough.
- **Sticky-stacking cards** — cards stick and scale down as later ones scroll over them
  (Framer `useScroll`/`useTransform`, `targetScale = 1 - (n-1-i)*0.03`). Product use: colorways /
  projects stacking. (STRYDE colorways)
- **Parallax columns** — two columns scroll at different rates inside a pinned area. Product use:
  detail/lifestyle gallery.

## Text
- **Letter-by-letter scrub reveal** — split into chars, opacity 0.14→1 staggered across scroll
  (GSAP scrub) or via CSS transition + class toggle (robust, ticker-independent). (Meridian, APSIS)
- **Word-mask reveal** — words in `overflow:hidden` spans rise from below. (APSIS)
- **Character opacity-on-scroll manifesto** — each char 0.2→1 by scroll progress
  (Framer `useScroll` offset `['start 0.8','end 0.2']`). (3D-creator ref, STRYDE manifesto)
- **Rotating words** — cycle a word list (Design/Create/Inspire) with AnimatePresence.
- **Animated counters** — count 0→N on enter (GSAP/Framer), tabular-nums. Product use: specs/stats.

## UI / micro
- **Glassmorphism** — `backdrop-blur` translucent nav/cards over 3D. (APSIS)
- **Magnetic hover** — element translates toward cursor within a padding radius. (3D-creator ref)
- **Kinetic marquee** — infinite horizontal scroll of words/images; scroll-reactive offset or
  CSS loop; two rows opposite directions. Product use: colorway/detail strip, footer CTA.
- **Gradient-border hover** — animated gradient ring behind buttons on hover.
- **Grain overlay** — fractalNoise SVG data-URI at low opacity for texture.
- **Preloader** — counter 000→100 + progress bar, or a column-wipe reveal. (MIRAGE, portfolio ref)
- **Floating 3D orbs** — soft drifting spheres in brand tint behind content; color-lerp on
  variant change. (STRYDE bg)
- **Bloom postprocessing** — `@react-three/postprocessing` Bloom for glow on bright 3D. (APSIS)

## House rules learned
- Drive Lenis with `gsap.ticker.add(t=>lenis.raf(t*1000))` OR a dedicated rAF; never init Lenis
  without driving its raf (it freezes scroll).
- Reveals must never leave content permanently hidden: prefer CSS-class reveals with a hard
  timeout fallback, or ScrollTrigger `toggleActions: play none none none`.
- Backgrounded tabs throttle rAF + CSS transitions to ~0; verify by DOM/geometry, not screenshots.
- Stack per build: React+Vite+TS+Tailwind; add r3f+drei+postprocessing for 3D, GSAP+Lenis for
  scroll, Framer Motion for reveals/sticky-stack. Deploy via `vercel --prod`.
