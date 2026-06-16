# Breakdown video template (single-site teardown)

Reusable template for the **single-site breakdown** format. To make a new one you
just **swap the images and change the colour** — no code edits.

## Make a new breakdown

1. **Drop the section images** in `assets/breakdowns/<site-slug>/`, named in slide
   order: `01-hero.png`, `02-<section>.png`, … `NN-<section>.png`.
2. **Add `sections.yaml`** in that folder with the site's `brand_color` (this is the
   slide-number colour) — e.g. `brand_color: '#6E1228'`.
3. **Render:**
   ```
   node templates/breakdown/make-tiktok.js <site-slug>
   node templates/breakdown/make-square.js <site-slug>
   ```
   Output lands in `campaigns/<site-slug>-breakdown/exports/{tiktok,instagram,linkedin}/`.
   (Optional 2nd arg overrides the campaign folder name.)
4. Zip + deliver as usual; write the caption.

## Locked spec (do not drift)

- **Light** clean background (cream gradient).
- Each slide = **the full section image** (no crop/bleed), fit and **centred exactly**
  (the template scales to ~90% so it isn't edge-to-edge).
- Small **slide-number ring** top-centre (Instrument Serif italic number + `/ NN`
  total), coloured with the **site's `brand_color`**.
- **No other text** on slides. One slide per section. CTA goes in the caption.

Reference: `campaigns/2026-06-16-sable-breakdown/` (built from this template).
