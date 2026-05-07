# Fast Launch — Working Rules for Claude

This file is loaded automatically as context whenever I'm working in this project. It captures the operational rules I must follow on every post. The full creative brief lives in the original spec (sent in Discord — see "Fast Launch — Daily Social Creative System"); this file is the **operational checklist on top of it**.

---

## Hard Rule: TikTok PNGs Must Be Phone-Downloadable via Direct catbox URLs

Jack uploads TikTok manually from his phone (TikTok's API doesn't allow third-party auto-posting), so **every TikTok PNG must arrive as a tap-to-open direct URL, not as a Discord WebP preview or a ZIP that needs extraction.**

LinkedIn and Instagram do **not** need this — those are auto-posted via the API directly from desktop, so Jack never touches the PNGs himself. Sending them as regular Discord PNG attachments is fine for review purposes.

**TikTok delivery flow (mandatory for every campaign):**

1. After rendering, upload every `exports/tiktok/*.png` to catbox.moe.
2. Send Jack the direct URLs in this exact channel as a numbered list with a label per slide (so he knows posting order).
3. He taps each link on phone → PNG opens in browser → long-press → "Save Image" → camera roll → ready for TikTok.

```bash
cd exports/tiktok
for f in *.png; do
  curl -sS -F "reqtype=fileupload" -F "fileToUpload=@$f" https://catbox.moe/user/api.php
done
```

The catbox URL list is the canonical TikTok delivery format. Always include it — even alongside any other previews.

---

## Hard Rule: Deliver Final Content as ZIPs, Not Loose Images

When sending the rendered exports to Jack via Discord, **always bundle them as ZIP archives** — one per platform. Discord automatically re-encodes loose image attachments to WebP, which strips them of the PNG fidelity Jack needs for posting.

**Per campaign, generate two ZIPs:**
- `<slug>-tiktok.zip` — all 1080×1920 PNGs from `exports/tiktok/`
- `<slug>-linkedin.zip` — all 1080×1080 PNGs from `exports/linkedin/`
  (no separate IG zip — the LinkedIn ZIP is identical, save the user the duplicate)

Save them to `campaigns/<slug>/exports/zips/` so they're versioned alongside the campaign.

**Workflow:**
```ps
Compress-Archive -Path 'exports/tiktok/*.png'   -DestinationPath 'exports/zips/<slug>-tiktok.zip'   -CompressionLevel Optimal
Compress-Archive -Path 'exports/linkedin/*.png' -DestinationPath 'exports/zips/<slug>-linkedin.zip' -CompressionLevel Optimal
```

Send both ZIPs via the Discord reply tool. They preserve the original PNGs untouched and Jack can extract them on phone or desktop without Discord's image pipeline interfering.

**For mid-review iterations** (when Jack wants to see one slide changed), it's fine to send single PNGs as previews — Discord's WebP preview is acceptable for review purposes. The ZIP rule applies to the **final delivery** of a complete campaign.

### Direct PNG URLs (for phone download)

Discord's mobile clients save attached images as WebP and ZIPs require fiddly extraction. So **alongside the ZIPs, also upload each PNG to catbox.moe and send the direct URLs**. Tapping a `https://files.catbox.moe/abc.png` URL on phone opens the original PNG, which can be long-pressed → "Save Image" straight to the camera roll.

```bash
# In the campaign folder, for both tiktok/ and linkedin/ exports:
for f in *.png; do
  curl -sS -F "reqtype=fileupload" -F "fileToUpload=@$f" https://catbox.moe/user/api.php
done
```

Send the URLs grouped by platform with a label per slide so Jack knows which is which.

---

## Hard Rule: No Em Dashes or Double Dashes in Captions or Slide Copy

Never use `—` (em dash, U+2014), `–` (en dash, U+2013), or `--` (double hyphen) anywhere in:
- LinkedIn / Instagram / TikTok captions
- Slide headlines, subheads, body copy
- Footer / eyebrow text

**Replacements:**
- For pause/aside emphasis → use a comma, period, or restructure the sentence
- For range like "3-14 days" → regular hyphen `-` is fine (it's not a dash style choice, it's part of the number)
- For lead-ins ("If you want X — we build Y") → use a colon ("If you want X: we build Y") or a period ("If you want X. We build Y.")

This applies to caption files, slide source, banner copy, everything Jack receives. If you spot an em dash in any deliverable, fix it before sending.

---

## Hard Rule: Always Vertically Centre the Content

**On every slide of every campaign, every format, every theme**, the content block (everything except the logo block at the top and the footer URL at the bottom) must sit **dead-centred vertically** between the bottom of the logo and the top of the footer.

**Implementation pattern:**
```js
const TOP_BOUND    = 200;       // bottom of logo block + breathing room
const BOTTOM_BOUND = H - 130;   // top of footer + breathing room

// Pre-measure every element + gap → sum to totalH
const totalH = el1Height + gap1 + el2Height + gap2 + ... ;

// Centre it
const startY = TOP_BOUND + Math.max(0, (BOTTOM_BOUND - TOP_BOUND - totalH) / 2);

// Walk a cursor from startY, drawing each element in sequence
let cursorY = startY;
// draw element 1 at cursorY
cursorY += el1Height + gap1;
// draw element 2 at cursorY ...
```

**Never** hardcode y values per element on a slide-by-slide basis — always compute totalH and derive startY. Otherwise the content drifts toward the top whenever body length, headline lines, or doodles change.

This rule applies to every layout: hooks, numbered insight slides, CTA closers, statement closers, screenshot slides, anything. Logo stays fixed at the top (per the Logo + wordmark spec). Footer stays fixed at the bottom. **Everything between gets centred.**

---

## Hard Rule: Export to All Three Platforms, Every Time

Every post ships in **three formats** and lands in **three folders**:

```
campaigns/<slug>/exports/
├── tiktok/        ← 1080 × 1920  (portrait, 9:16)
├── instagram/     ← 1080 × 1080  (square,   1:1)
└── linkedin/      ← 1080 × 1080  (square,   1:1, identical to IG)
```

**Required for every post:**
1. Generate the **TikTok** PNGs at 1080 × 1920 → save to `exports/tiktok/`
2. Generate the **Square** PNGs at 1080 × 1080 → save to `exports/instagram/`
3. **Also copy the same square PNGs to `exports/linkedin/`** — IG and LinkedIn share the format per the spec, but they live in different folders so you can post independently
4. Source HTML / build script lives in `slides/`
5. Client-supplied screenshots / source assets live in `references/`

**Never ship a post with only one or two platforms populated.** If a folder is empty, the post is incomplete.

---

## Campaign Folder — Created on Demand

Do not pre-create empty campaign folders. When a new project is briefed, build the folder fresh with this structure:

```
campaigns/<slug>/
├── slides/
├── references/
├── exports/
│   ├── tiktok/
│   ├── instagram/
│   └── linkedin/
└── README.md
```

Slug is kebab-case, named after the project (e.g. `aramas`, `motor-parts-allai`, `aj-gammond`).

---

## After Every Post

1. Append a row to `content-calendar.md` (date, slug, content type, theme, platforms shipped, notes)
2. Send all 7 (or however many) PNGs back to the user in Discord — separately for each platform if they want to spot-check
3. Write the three captions (TikTok / Instagram / LinkedIn) per the spec's §9 rules

---

## Reference Library

- `colors_and_type.css` — design tokens (dark + light themes)
- `deck-stage.js` — HTML carousel runtime
- `fonts/` — Space Grotesk (Bold + Medium), Instrument Serif Italic, JetBrains Mono Medium
- `brand/logo-mark.png` — orange lightning bolt
- `open-design-ref/` — pattern bank: 31 design skills + 129 design systems. Consult the matching skill before building (e.g. `xhs-post` for IG carousels, `magazine-bold` for hot takes)

---

## Source of Truth

The original creative spec (themes, content types, type scale, hard rules, slide chrome) is the authoritative brief. This file only adds **operational** rules — folder layout, export discipline, and the run-through-every-time checklist.

---

## Screenshot Capture — Always Use `screenshot.js` for Client Sites

Case study campaigns require real screenshots of the client site. **Never** generate placeholder boxes or describe the product from the URL alone — capture the actual page.

The repo ships a working headless-Chromium screenshot util at `screenshot.js`:

```bash
node screenshot.js <url> <out-path.png> [--width=1280] [--height=1800] [--full] [--wait=3000]
```

- Bundles Chromium via `@sparticuz/chromium` (binary inside the npm tarball, no separate download needed — works in network-restricted sandboxes).
- Drives it with `puppeteer-core`. Ignores TLS errors so sandbox MITM proxies don't break it.
- Use `--full` for full-page scrolling captures, omit for viewport-only hero shots.

**Standard capture set per case study campaign:**

```bash
mkdir -p campaigns/<slug>/references
node screenshot.js <url>          campaigns/<slug>/references/landing.png        --width=1280 --height=1800 --full --wait=3000
node screenshot.js <url>          campaigns/<slug>/references/landing-hero.png   --width=1280 --height=900  --wait=3000
node screenshot.js <url>/app      campaigns/<slug>/references/app.png            --width=1280 --height=1800 --full --wait=3500
node screenshot.js <url>/app      campaigns/<slug>/references/app-hero.png       --width=1280 --height=900  --wait=3500
```

After capture, **always Read each PNG to verify** it shows the actual product, not a proxy block page. If a screenshot shows `Host not in allowlist` (or any other error page rendered as content), the sandbox allowlist is missing that host — see below.

---

## Sandbox Allowlist — Required Hosts for Full Automation

This environment runs an outbound proxy (`CLAUDE_CODE_PROXY_RESOLVES_HOSTS=true`) that drops requests to non-allowlisted hosts and serves a "Host not in allowlist" page. **No code workaround exists from inside the sandbox** — even a real headless browser hits the same proxy. The allowlist must be configured in the harness that spawns these sessions.

For the Fast Launch pipeline to run end-to-end, the allowlist needs:

| Host                              | Used for                                          |
|-----------------------------------|---------------------------------------------------|
| Arbitrary outbound HTTPS, or      | Capturing client-site screenshots (per-campaign — domain unknown until briefed) |
| `*.vercel.app`                    | Most client demos / portfolios                    |
| `files.catbox.moe`, `catbox.moe`  | TikTok PNG delivery (canonical per Hard Rule #1)  |
| `api.linkedin.com`                | LinkedIn auto-posting (`posting/post-linkedin.js`) |
| `graph.facebook.com`              | Instagram auto-posting (`posting/post-instagram.js`) |
| `cdn.jsdelivr.net`                | Fontsource font downloads (only needed for first-time font setup; fonts are vendored to `fonts/` after that) |

**Already allowlisted (verified):** `registry.npmjs.org`, `github.com`, `pypi.org`, `files.pythonhosted.org`.

If a session can't reach a host it needs, do not invent workarounds or ship placeholder content — surface the missing host to Jack so he can update the allowlist.

---

## Posting Workflow — Claude Runs The Command, Jack Stays in Discord

Jack does not run terminal commands himself. When a campaign is approved and ready to publish, the workflow is:

1. **Jack messages in Discord:** *"Post the Aramas carousel to LinkedIn"* (or Instagram, once wired).
2. **Claude:**
   a. Verifies the campaign exists and the platform exports + caption file are present.
   b. Runs a dry-run first to print the preview if there's any uncertainty about the caption or image order.
   c. Runs the real post command:
      - LinkedIn: `node posting/post-linkedin.js <slug>`
      - Instagram: `node posting/post-instagram.js <slug>` (once wired)
   d. Pastes the resulting post URL back to Jack in Discord, and reacts with a checkmark on his original message.
3. **TikTok always stays manual** — TikTok's API doesn't allow third-party auto-posting. Claude generates the assets and the caption; Jack uploads from his phone.

### Future automation (Task Scheduler)
Once Jack has weeks of content built up, we'll add a Windows Task Scheduler entry that:
- Runs daily on a schedule (e.g. 9am Mon–Fri)
- Reads the next un-posted campaign from `content-calendar.md`
- Posts to LinkedIn + Instagram automatically
- Logs the post URLs back to `content-calendar.md`

For now, posting is Discord-driven on-demand.

---

## Reflowing TikTok (1080×1920) → Square (1080×1080) for IG + LinkedIn

This is the recipe used for the Aramas reference build. Apply the same rules to every future campaign.

### Canvas

| Format    | Dimensions | Aspect | Used for                |
|-----------|-----------|--------|-------------------------|
| Portrait  | 1080×1920 | 9:16   | TikTok                  |
| Square    | 1080×1080 | 1:1    | Instagram + LinkedIn    |

You **do not stretch a portrait deck into a square**. The whole layout reflows: type shrinks ~25–35%, vertical gaps tighten, screenshots cap at smaller heights, multi-row content (timelines, results grids) re-balances.

### Type scale — the exact reductions

| Role           | Portrait (TikTok) | Square (IG/LinkedIn)   | Family                              |
|----------------|-------------------|------------------------|-------------------------------------|
| Display        | 96–100 px         | 70–76 px               | Space Grotesk Bold                  |
| H1 headline    | 88–92 px          | 60–64 px               | Space Grotesk Bold                  |
| Italic accent  | matches H1        | matches H1             | Instrument Serif Italic             |
| Subhead        | 48 px             | 32–36 px               | Instrument Serif Italic             |
| Stat number    | 46–96 px          | 36–72 px               | Space Grotesk Bold                  |
| Body / list    | 32–36 px          | 22–26 px               | Space Grotesk Medium                |
| Eyebrow (mono) | 22–24 px          | 17–18 px               | JetBrains Mono Medium               |
| Footer URL     | 26–28 px          | 18–22 px               | JetBrains Mono Medium               |

### Slide chrome (consistent across both formats)

| Element             | Portrait y        | Square y           |
|---------------------|-------------------|--------------------|
| Top orange bar      | 4 px, full width  | same               |
| Logo mark size      | 64 px             | 40–48 px           |
| Logo y position     | 96 px from top    | 36 px from top     |
| Wordmark            | 32 px below logo  | 22 px below logo   |
| Footer URL position | y = H − 36        | y = H − 32         |
| Footer style        | uppercase, mono, letter-spacing 3–4 px (faked via `fillSpaced` helper since canvas has no native letter-spacing)

### Vertical centering — the rule

After the logo block ends and before the footer starts, **the content block must sit dead-centre**.

```
HEADER_BOT = 116      (bottom of wordmark + 8 px breathing room)
FOOTER_TOP = 1010     (top of footer text)
CONTENT_MID = 563

For each slide:
  totalH = sum of all element heights + gaps
  startY = HEADER_BOT + (FOOTER_TOP − HEADER_BOT − totalH) / 2
```

In practice, when porting from a portrait deck I add a per-slide `Y` offset constant that shifts every y value down by the right amount. Eyebrow-led slides need bigger offsets (their visual centre starts higher), screenshot-heavy slides need smaller ones.

### Layout details that change between formats

- **Headlines:** keep two-line break (`headline1 / headline2`) — re-flow words if the new line length doesn't sit nicely.
- **Screenshots:** cap height at ~380 px on square (vs ~600 px on portrait). Object-position cropping often needed to surface the right slice of the page.
- **Stat pills (3-up row):** narrower pills (220 px each), tighter padding, stat number 32 px instead of 46–96 px.
- **Problem list:** card height 76 px (vs ~110 px portrait), inner padding tightens. Keep the orange × marker but at 26 px instead of 36 px.
- **Timeline:** keep all 6 day rows but reduce row height to 56 px and gap to 8 px. Day chip pill 90 × 38 px.
- **Results grid (2×2):** cell height 200 px (vs ~280 px portrait), big number 64 px, label 20 px.
- **CTA pill button:** height 64 px (vs ~96 px portrait), text 24 px. **Vector arrow drawn as a path** — Space Grotesk Bold has no `→` glyph (U+2192) so unicode arrows render as missing-glyph tofu. Always draw arrows manually with `lineTo` + filled triangle head.
- **Statement slide:** orange rule 60 × 4 px (vs 80 × 4 px), three headline lines, italic 2-line subhead.

### Fonts — non-negotiable setup

The brand type system **must** render correctly. Steps to make node-canvas pick up the fonts:

1. Download the TTFs from jsDelivr Fontsource (or equivalent):
   - `https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf`
   - `https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-500-normal.ttf`
   - `https://cdn.jsdelivr.net/fontsource/fonts/instrument-serif@latest/latin-400-italic.ttf`
   - `https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-500-normal.ttf`
2. Save them to `fonts/` in this project.
3. **Install them into Windows user fonts** — `%LOCALAPPDATA%\Microsoft\Windows\Fonts\` and register in `HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts`. Without this, node-canvas's `registerFont()` aliases get overridden by the font's internal name and the lookup falls back to Sans.
4. In the script, register using the **TTF's actual internal family name** (e.g. `'Space Grotesk Bold'`, not `'SpaceGrotesk'`):
   ```js
   registerFont('fonts/SpaceGrotesk-Bold.ttf',      { family: 'Space Grotesk Bold' });
   registerFont('fonts/SpaceGrotesk-Medium.ttf',    { family: 'Space Grotesk Medium' });
   registerFont('fonts/InstrumentSerif-Italic.ttf', { family: 'Instrument Serif Italic' });
   registerFont('fonts/JetBrainsMono-Medium.ttf',   { family: 'JetBrains Mono Medium' });
   ```
5. Reference them in `ctx.font` strings with the family name in quotes:
   ```js
   ctx.font = '60px "Space Grotesk Bold"';
   ctx.font = '32px "Instrument Serif Italic"';
   ctx.font = '17px "JetBrains Mono Medium"';
   ```

### node-canvas gotchas to remember

- **`roundRect` corner radius must be clamped** to `min(w/2, h/2)` — otherwise `r = 999` (pill rounding) on small elements blows the path out into a cross/plus shape.
- **No native letter-spacing.** Use the `fillSpaced(ctx, text, x, y, spacing)` helper that draws each character individually with manual offsets.
- **Shadow blur leaks if too aggressive.** CTA buttons should use `shadowBlur: 22` max with `shadowOffsetY: 10`. Anything bigger and the orange glow will bleed past the canvas edges.
- **`textAlign` and `textBaseline` are sticky.** Reset them at the top of each draw block to avoid surprises.

### Workflow per new campaign

1. Create the campaign folder + standard subfolders (only when actually shipping).
2. Drop client screenshots into `references/`.
3. Build the portrait (`make-tiktok.js` or HTML deck) → render to `exports/tiktok/`.
4. Build the square (`make-square.js`) by re-flowing the portrait per the rules above → render to `exports/instagram/`.
5. Copy the IG outputs to `exports/linkedin/` (identical files, separate folder).
6. Verify all three folders have all the slides.
7. Append to `content-calendar.md`.
8. Send all three sets back via Discord with the three captions.
