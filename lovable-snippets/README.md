# Lovable Snippets

Reusable, proven code components to hand to Lovable on future builds instead of letting the agent reinvent them.

## ScrollVideoStage.tsx

Pinned full-screen background video scrubbed by page scroll. Plays forward on scroll down, reverses on scroll up. Never autoplays, smoothed with a lerp (0.18) so the scrub feels fluid, clamps to the seekable range so it doesn't fail silently while buffering.

**How to use on a build:**
1. Drop the file into `src/components/`.
2. Render it once, behind everything, near the top of the page: `<ScrollVideoStage src="/hero.mp4" poster="/hero-poster.jpg" />`.
3. The page content scrolls over it (the stage is `fixed inset-0 z-0`), so give your content sections a higher z-index and transparent/tinted backgrounds where you want the video to show through.
4. Feed it a short, compressed, frame-seek-friendly mp4 (keyframe-dense). Long or lightly-keyframed videos scrub poorly.

**Per-site tweaks:**
- `bg-[var(--forest)]` placeholder background color, swap to the site's base token.
- `filter: saturate/contrast/brightness` on the video, tune to taste.
- `rgba(10,25,18,0.32)` dark tint overlay, adjust for legibility against the site palette.

This is the canonical implementation of the standing "scroll-driven video parallax" rule.
