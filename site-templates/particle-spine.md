# Particle Spine — Scroll Site Template

A reusable, premium, dark scroll site in the style of the "Swarm" reference build. Built to be
**screen-recorded on a laptop and posted as social content** (Fast Launch: TikTok / IG / LinkedIn).
The brand is invented fresh each time. This file documents the system once, then fills in one
worked instance ("Meridian") you can swap wholesale.

- **Animation set:** Particle Spine (3D scroll) + Immersive Reveal + Layer Transformation
- **Asset budget:** Lean. Exactly 1 Higgsfield asset (a looping background motion graphic). Everything
  else is procedural, so it costs zero credits.
- **Why this trio:** all three ride a single smooth scroll timeline, so nothing competes. The particles
  are the continuous spine, the reveals are punctuation, the layers add depth. No video playback to sync,
  no jank, no extra generations.

---

## 1. The animation system

### A. Particle Spine (the backbone)
One WebGL points system (~12k to 18k particles) in a fixed full-screen canvas behind everything (z-0).
A single scroll progress value (0 to 1), smoothed by Lenis and scrubbed by GSAP ScrollTrigger, lerps
every particle from one set of target positions to the next as you move down the page. Each "shape" is
just a `Float32Array` of XYZ targets sampled from a form (sphere surface, globe lat/long grid, torus,
scattered field). A little per-particle noise drift keeps it breathing even when still. Colour is the
brand gradient (deep indigo and violet with warm gold flecks), matching the reference.

### B. Immersive Reveal (the text)
Each pinned section's copy reveals exactly as its shape finishes forming: opacity plus a short upward
translate plus a clip-path wipe, staggered line by line. It is tied to the same ScrollTrigger as the
particle morph, so the shape and the words land together. That synchronisation is what reads as
"expensive."

### C. Layer Transformation (the depth)
Three parallax layers move at different scroll rates with slight scale and rotation:
1. Back: the single Higgsfield motion-graphic loop (slow drift, low opacity).
2. Mid: the particle canvas.
3. Front: the text and nav.
This gives real 3D depth with no extra assets.

### Performance and credit budget
- Procedural particles and CSS layers: 0 credits.
- Cap device pixel ratio at 2, pause the render loop when the tab is hidden, one draw call for the points.
- Respect `prefers-reduced-motion`: fall back to static shapes and simple fades.

---

## 2. Particle storyboard (scroll map)

| Scroll | Particle shape | Camera | Copy beat |
|--------|----------------|--------|-----------|
| 0.00 | Loose drifting nebula cloud | slow push in | Hero |
| 0.18 | Converges into a rotating globe (lat/long points) | orbit slightly | "Latency you can feel disappear" |
| 0.36 | Globe bursts outward into a scattered starfield | pull back | Problem (two stacked statements) |
| 0.55 | Reassembles into flowing orbit rings (torus) | tilt | "Deploy once. Run everywhere" |
| 0.72 | Tightens into a glowing core sphere | center | "Scale to a planet" |
| 0.86 | Partial spiral beside the FAQ | hold | "Questions, answered" |
| 1.00 | Disperses back to a calm starfield | drift out | Final CTA |

The whole way down it is the **same** particle object, never a cut. That continuity is the core trick.

---

## 3. Full site script (instance: "Meridian")

> Brand: **Meridian**. Product: a planet-scale edge network for real-time software.
> Swap the name, product and copy for the next build. No em dashes, en dashes, or double hyphens anywhere.

### Nav (persistent, top)
- Left: logo mark + wordmark `Meridian`
- Right: `NETWORK`  `DOCS`  `PRICING`  + pill button `Get access`

### 1. Hero
- Eyebrow (mono): `ONE NETWORK. EVERY REGION.`
- Headline: **Software that feels local everywhere.**
- Subhead: Meridian runs your app at the edge of every network, so the people using it never wait. Real time, planet wide, nothing to manage.
- CTA: `Get access`
- Particles: loose drifting nebula. Reveal: headline wipes up line by line.

### 2. Value
- Eyebrow: `BUILT FOR REAL TIME`
- Headline: **Latency you can feel disappear.**
- Body: Every request lands on the nearest node. Compute, data and state move with your users, so an app in Tokyo answers as fast as one next door.
- Particles: cloud converges into the rotating globe.

### 3. Problem (two stacked statements over the starfield)
- Statement A
  - Headline: **Central servers put your users in line.**
  - Body: One region, one queue. The further away someone sits, the longer they wait, and the more your product feels slow.
- Statement B
  - Headline: **Managing regions is its own full time job.**
  - Body: Spinning up clusters, syncing data, chasing failovers. Most of your time goes to the map instead of the product.
- Particles: the globe explodes into a scattered field (the "exploding objects" beat).

### 4. The shift (how it works)
- Eyebrow: `A DIFFERENT SHAPE OF INFRA`
- Headline: **Deploy once. Run everywhere.**
- Body: Push your code and Meridian places it across the planet for you. State follows the request, scaling up and down on its own.
- Particles: reassemble into flowing orbit rings.

### 5. Scale / proof
- Eyebrow: `FROM ONE USER TO MILLIONS`
- Headline: **Scale to a planet.**
- Body: Start in one region. Grow to every continent without rewriting a line. Meridian handles placement, routing and recovery so your network stays fast and in sync.
- Optional stat row (text only, no assets): `300+ edge locations`  `12ms median`  `99.99% uptime`
- Particles: tighten into the glowing core sphere.

### 6. FAQ
- Headline: **Questions, answered.**
- What is Meridian? A planet-scale edge network for building real-time software, from a single app to a global product running in production.
- Do I manage regions? No. You deploy once and Meridian places and scales your app across its network for you.
- Does my data move too? Yes. State and storage follow each request to the nearest node, so reads and writes stay local and fast.
- How do I start? Connect a repo, push, and your app goes live at the edge in minutes.
- Particles: partial spiral beside the column of questions.

### 7. Final CTA
- Eyebrow: `ONE APP. EVERY REGION.`
- Headline: **Go live everywhere.**
- Subhead: Stop managing the map. Start shipping real time.
- CTA: `Get access`
- Particles: disperse back to a calm drifting starfield.

### Footer
- `Meridian` wordmark, the three nav links repeated, small print placeholder.

---

## 4. Higgsfield asset manifest (Lean: 1 asset)

Only one generated asset. Everything visual beyond this is the procedural particle system and CSS layers.

**ASSET 01 — Hero ambient background loop**
- Purpose: the back parallax layer behind the particles. Adds volumetric depth that is expensive to fake
  procedurally. Sits at low opacity with a screen/additive blend, slow parallax drift.
- Type: seamless looping video, about 8 to 12 seconds, 16:9 (we crop for vertical later).
- Prompt to use in Higgsfield:
  > Abstract dark background motion graphic, slow drifting volumetric light and fine particle haze, deep
  > indigo and violet with subtle warm gold flecks, soft bokeh, gentle parallax depth, seamless loop, no
  > text, no objects, cinematic, very high contrast against near black, 4k.
- Keep it abstract and loopable so we never need to regenerate it (credit safety).

Deliberately excluded to protect credits: hover live-reveal video clips, per-section footage, generated
stills. We can add them later if a specific build needs them.

---

## 5. Build stack and notes

- **Stack:** React + react-three-fiber + @react-three/drei, GSAP + ScrollTrigger, Lenis (smooth scroll).
- **Fonts:** reuse the Fast Launch brand kit, Space Grotesk Bold (headlines), Instrument Serif Italic
  (accent words), JetBrains Mono Medium (eyebrows). Tokens from `colors_and_type.css` (dark theme).
- **Lovable vs custom:** this is a real r3f build and likely past Lovable's comfort zone. Recommended to
  build the particle component standalone (Vite) or as a reusable entry in `lovable-snippets/`, then
  embed. Decide before building.
- **Recording:** built to be screen-recorded at 4k like the reference, then cut to 1080x1920 (TikTok) and
  1080x1080 (IG / LinkedIn) for posting.

---

## 6. Reuse checklist (next build)
1. New invented brand + product (1 line each).
2. Rewrite the 7 section copy blocks to that product.
3. Keep the storyboard and animation system as-is.
4. Reuse ASSET 01 if the palette matches, or regenerate only if the brand colour changes.
