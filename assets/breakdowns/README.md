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
- **Number graphic:** a small ring with the slide number inside (Instrument Serif
  italic) + a tiny `/ NN` total beneath. Relatively small, top-centre. **Ring/number
  colour matches the site's brand colour** (e.g. Sable = red-burgundy `#6E1228`).
- **Show the FULL image** — the whole section must be visible, no cropping or
  bleeding. Fit it within the area and **centre it vertically (and horizontally)
  exactly.** Subtle card (soft shadow + hairline) so it reads on the light bg.
- One slide per section, numbered in order. No separate hook/CTA slides (the CTA
  lives in the caption).

Reference build: `campaigns/2026-06-16-sable-breakdown/` (`make-tiktok.js` + `make-square.js`).
