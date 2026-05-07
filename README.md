# Auto-gen-content

Fast Launch content generation + auto-poster system.

## What's in here

- `campaigns/` — per-campaign assets (slides, captions, references, exports)
- `posting/` — auto-poster scripts for LinkedIn + Instagram (Graph API)
- `banners/` — generators for LinkedIn / Facebook cover banners
- `brand/` — brand assets (logo, showcase imagery)
- `fonts/` — local font files used by canvas/HTML renderers
- `colors_and_type.css` — design tokens (colours + typography)
- `convert-pdf.js`, `pdf-to-images.js`, `deck-stage.js` — utilities

## Setup

```bash
npm install
cp .env.example .env   # then fill in your credentials
```

`.env` is gitignored — never commit live tokens.

## Posting

```bash
node posting/post-linkedin.js <campaign-slug>
node posting/post-instagram.js <campaign-slug>
```

See `CLAUDE.md` for the full workflow and Discord-driven posting commands.
