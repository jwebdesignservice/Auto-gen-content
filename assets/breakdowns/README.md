# Site Breakdowns — section images

Source images for **single-site breakdown** videos (one of the winning TikTok
formats: a teardown of one site, section by section).

**Convention** — one folder per site, files numbered in slide order with the
section name:

```
breakdowns/<site-slug>/
  01-hero.png
  02-<section>.png
  03-<section>.png
  ...
  NN-<section>.png   (last is usually footer/close)
  sections.yaml      (site name, brand colour, ordered section labels)
```

Each numbered image is one section of that specific site, shown on one slide of
the breakdown carousel. New concepts get a new `<site-slug>/` folder here.

## Design spec — REQUIRED for every breakdown video (locked 2026-06-16)

- **Light background**, clean and minimal (soft cream gradient). Not site-coloured.
- **Each slide shows ONLY: the section image + a small slide-number graphic at the
  top.** No headings, labels, notes, hook copy or CTA text on the slides.
- **Number graphic:** a small orange ring with the slide number inside (Instrument
  Serif italic) and a tiny `/ NN` total beneath. Kept relatively small, top-centre.
- Section image sits in a subtle card (soft shadow + hairline) so it reads on the
  light background; short/landscape sections centre, tall sections bleed off the bottom.
- One slide per section, numbered in order. No separate hook/CTA slides (the CTA
  lives in the caption).

Reference build: `campaigns/2026-06-16-sable-breakdown/` (`make-tiktok.js` + `make-square.js`).
