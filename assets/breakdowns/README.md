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

## Design spec + how to build

The complete, authoritative requirements for the breakdown creative (light bg,
image-only slides, number-ring graphic, centring rules, colours, formats) and the
render flow live in **`templates/breakdown/README.md`**. Read that before building.

Reference build: `campaigns/2026-06-16-sable-breakdown/` (Sable).
