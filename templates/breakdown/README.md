# Breakdown video — FULL SPEC & template (single-site teardown)

The **single-site breakdown** is one of Jack's winning TikTok formats: a section-
by-section teardown of ONE website. This file is the complete, authoritative list
of requirements for the creative. Don't drift from it. To make a new one you just
**swap the images and change the colour** — no code edits.

## Make a new breakdown (the whole flow)

1. **Section images** → `assets/breakdowns/<site-slug>/`, named in slide order:
   `01-hero.png`, `02-<section>.png`, … `NN-<section>.png`. (Jack sends these.)
2. **`sections.yaml`** in that folder with the site's `brand_color` (the slide-
   number colour), e.g. `brand_color: '#6E1228'`.
3. **Render:**
   ```
   node templates/breakdown/make-tiktok.js <site-slug>
   node templates/breakdown/make-square.js <site-slug>
   ```
   → `campaigns/<site-slug>-breakdown/exports/{tiktok,instagram,linkedin}/`
   (optional 2nd arg overrides the campaign folder name).
4. Zip per platform, upload TikTok PNGs to litterbox, write the caption, deliver
   in Discord. Do NOT post without an explicit "post it".

## Locked requirements (every breakdown video)

**Background:** LIGHT, clean, minimal — cream gradient (`#FFFCF8 → #F4EEE4`).
Never site-coloured.

**Slide 1 is ALWAYS the full-bleed cover** — the whole site (its full-page
screenshot) in the breakdown style, slimmer width, top-anchored so it bleeds off
the bottom, with the number ring above it. The section slides then follow,
**renumbered to start at 02** (total = sections + 1). Render the cover with the
`make-cover.js` pattern (reads `assets/past-work/<slug>/full.png`); render the
sections with `make-tiktok/square.js <slug> <campaign> 2 <total>` so they number
02…N. CTA lives in the caption.

**Per slide — image + number ONLY.** No headings, labels, section notes, hook
copy or CTA text anywhere on the slides. One slide per section.

**The image:**
- Show the **FULL image** — the whole section visible, never cropped or bled.
- Fit within the content area and scale to **~90%** so it's inset, not edge-to-edge
  ("slightly less wide").
- Sits in a subtle card: soft drop shadow + a faint hairline border, so light
  sections still read on the light background.
- **Horizontally centred** always.

**Vertical position (important nuance):**
- **Slide 1 (the hero)** is centred on the **true middle of the slide** — as if the
  number weren't there (equal margins top & bottom).
- **Slides 2…N** are centred within the **area below the number** (their original
  position). Do NOT recentre these on the slide middle.

**Slide-number graphic (top-centre):**
- A small ring with the slide number inside (Instrument Serif italic) and a tiny
  `/ NN` total beneath it. Relatively small.
- Coloured with the **site's `brand_color`** (e.g. Sable red-burgundy `#6E1228`).

**Formats:** TikTok 1080×1920 (chrome-off) + square 1080×1080 for IG + LinkedIn.

**Caption:** studio "we" voice, no em dashes (per the global caption rules). Carries
the CTA.

Reference build: `campaigns/2026-06-16-sable-breakdown/` (Sable, built from this template).
