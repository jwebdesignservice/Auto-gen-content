# Meridian — Particle Spine scroll site

A standalone build of the Particle Spine template (see `../../site-templates/particle-spine.md`).
Invented brand ("Meridian"), built to be screen-recorded and posted as Fast Launch content.

## Animations in this build
- **Particle Spine:** one WebGL particle system (14k points) morphs nebula → globe → starfield
  (explode) → orbit rings → core sphere → spiral → starfield as you scroll. `src/components/ParticleField.jsx`
  + `src/lib/shapes.js`.
- **Immersive Reveal:** each section's lines fade and rise in on scroll (GSAP ScrollTrigger). `src/App.jsx`.
- **Layer Transformation:** ambient background, particle canvas, and text move as three depth layers.
  Background is `.bg-layer` (CSS placeholder) until ASSET 01 is dropped in.

## Run
```bash
npm install
npm run dev      # http://localhost:5181
```

## Record for posting
Open full screen in a browser, scroll slowly top to bottom, screen-record at the highest resolution.
Then cut to 1080x1920 (TikTok) and 1080x1080 (IG / LinkedIn) per the Fast Launch workflow.

## ASSET 01 (Higgsfield, optional, lean budget)
Drop the generated ambient loop at `public/hero-loop.mp4`, then uncomment the `<video className="bg-video">`
line in `src/App.jsx`. Prompt is in `../../site-templates/particle-spine.md`.

## Swap the brand
Rewrite the copy in `src/components/Content.jsx`. Keep the storyboard and engine as-is.

## Notes
- `window.__freeze(true|false)` in the console pauses/resumes the render loop (dev helper for clean stills).
- Respects `prefers-reduced-motion` for the background layer.
