# Fast Launch — System Upgrade Proposal

**Date:** 2026-05-07
**Author:** Claude (Opus 4.7), drawing on parallel multi-agent research (audit + 2026 platform research + outcomes strategy)
**Status:** Proposal for Jack's review — no code changes have been made on the strength of this document

---

## 0. Executive Summary

Fast Launch already has a strong creative spine: brand tokens, a render pipeline, posting scripts for LinkedIn + Instagram, and a SessionStart hook that materialises credentials in the cloud sandbox. **The system is ~70% of the way to "publish daily, fully automated."**

The remaining 30% breaks down into three clusters:

1. **Bugs that will silently break posts** — the LinkedIn API endpoint we use is being deprecated, the IG Graph version is hard-coded to a release that may not be GA, and there's no code-level approval gate (the "no auto-post without approval" rule lives only in chat).
2. **A content strategy that hasn't been tuned to what's actually working in 2026** — current decks are 10+ slides with 1,500-char captions, when 2026 data shows 7 slides + 150-300 char captions outperform by 18%. Saves are now the strongest LinkedIn algorithm signal, and the system isn't designed for them.
3. **Manual steps blocking 95% automation** — no scheduler, no approval bot, no analytics ingestion, no auto-write to the content calendar, no caption generator, no weekly performance digest.

Estimated effort to close all three: **~30 hours of build, sequenced across one to two weeks**, with the highest-impact pieces shippable in the first 8.

---

## 1. Goal & Conversion Outcome

A 95% automated daily-content engine that turns viewers into people who DM Jack for a web dev / MVP build.

**Conversion priority (highest first):**
1. DM
2. Website / Calendly click
3. Follow
4. Like

Saves and shares are not direct conversion events but they are the strongest 2026 algorithm signals on LinkedIn and Instagram, so they're optimised for indirectly.

---

## 2. Current State Audit

### What works
- All 10 LinkedIn + Meta credentials present and well-shaped in `.env`.
- SessionStart hook (`.claude/hooks/session-start.sh`) materialises secrets and runs `npm install` on every session, idempotent and only-on-remote.
- Posting scripts handle the LinkedIn UGC and IG carousel happy paths with proper dry-run modes and carousel-size validation.
- Brand tokens defined in `colors_and_type.css`; reference renders exist in `campaigns/aramas/` and `campaigns/landing-page-essentials/`.
- Network allowlist now permits LinkedIn, Meta, Vercel, catbox, and jsdelivr (active in fresh sessions).

### Real bugs and risks (must fix before next post)

| # | Issue | Location | Risk |
|---|---|---|---|
| 1 | LinkedIn UGC v2 endpoint is deprecated | `posting/post-linkedin.js:102-117, 132-154` | Posts will start 410-ing whenever LinkedIn flips the switch. Migrate to the new Posts API (`/rest/posts` + `/rest/images?action=initializeUpload`) with `LinkedIn-Version` header. |
| 2 | Instagram Graph version hard-coded to v25.0 | `posting/post-instagram.js:38` | v25 may not be GA. Make version configurable + fall back to v23 if Meta returns "unsupported version". |
| 3 | No code-level approval gate | both posting scripts | Both scripts publish immediately when invoked without `--dry-run`. The "human approval required" rule lives only in chat. Add `--confirm` requirement + `.posted` marker file. |
| 4 | No token-expiry pre-check | both posting scripts | LinkedIn + IG long-lived tokens are 60-day. They'll silently expire mid-cadence. Add `--check-tokens` warn mode + a weekly refresh job. |
| 5 | No retry/backoff on rate limits or IG container polling errors | both posting scripts | Single transient 429 will fail an entire post. |

### Architectural debt (lower priority, but compounds)

| # | Issue | Recommendation |
|---|---|---|
| 1 | Render scripts are per-campaign hand-coded (Aramas alone is 559 lines) | Extract a shared `lib/` for chrome/centering/helpers + JSON slide manifest. A campaign becomes data, not 559 lines of script. |
| 2 | Brand tokens duplicated in 3 places (CSS + every JS render script) | Single source: `brand/tokens.js` consumed everywhere; generate the CSS file from it. |
| 3 | Helpers (`roundRect`, `fillSpaced`, `wrapText`, `baseCanvas`) duplicated verbatim across each `make-square.js` | Move to `lib/canvas-helpers.js`. |
| 4 | `content-calendar.md` is fully manual; nothing auto-writes after publish | Add a 1-hour script that appends a row on successful publish. |
| 5 | No em-dash / double-dash linter | CLAUDE.md hard rule has no enforcement; add a lint script that scans `captions/*.txt` and slide source. |
| 6 | No catbox-upload script for TikTok | Wrap the manual `for f in *.png; do curl ...` loop. |
| 7 | No ZIP automation | Wrap the `Compress-Archive` step CLAUDE.md mandates. |
| 8 | No Discord delivery script | Wrap the "send ZIPs + catbox URLs to Jack" step in a webhook script. |

---

## 3. 2026 Platform Research — Key Findings

Drawn from CarouselMaker, Oktopost, Sprout Social, Buffer, LinkBoost, TryMyPost, PostWaffle, and others (full source list at the bottom of this doc).

### LinkedIn
- **Organic reach down 60-66% on company pages since 2024.** Post from a personal profile, not a company page.
- **Saves and Sends are explicit metrics** in LinkedIn analytics as of late 2025. The new "Depth Score" weights them higher than likes.
- **Carousel slide count sweet spot dropped to 6-9. Specifically 7 performs 18% better.** (Was 12-13 in 2024.)
- **Carousel captions: 150-300 chars.** General LinkedIn posts still favour 1,300-1,900 chars but carousels are a different beast — keep tight.
- **Hashtags barely matter.** 3-5 max as a low-cost hedge.
- **No links in carousel body.** Put the link in the first comment, reference in caption.
- **Posting frequency:** 2-5x/week, Tue-Thu 10am-12pm local. Weekends die for B2B.

### Instagram
- **DM-shares count 3-4x more than likes** in 2026.
- **Carousels get 1.4x reach + 3.1x engagement vs single image.**
- **Posting frequency:** 4-5x/week, 7-10pm (8pm peak), Wed/Fri/Mon best.
- **CTAs:** "DM the word X" beats links every time. Pick one keyword per post.

### TikTok
- **PNG carousels currently boosted: 2-5x reach vs videos.** Jack's current format is well-aligned.
- **But: talking-head video is the highest-converting format for professional service firms.** Static talking heads underperform; quick-cut talking head + captions + screen recordings of real work win.
- **Behind-the-scenes / raw content gets 31% higher engagement than over-produced video.**
- **Posting frequency:** Daily TikTok posters see 3.5x faster follower growth than 2-3x/week. Saturdays are top day.

### Hook patterns proven in 2026 (dev/agency niche)
The five winning first-line formulas: **counterintuitive claim, specific number, open loop, direct question, bold statement**. Hook must promise a concrete outcome in the first 210 chars.

Templates:
1. "I built [product] in [X days]. Here's the stack." (open loop + specificity)
2. "Most founders waste 6 months on an MVP. We ship in 14 days. Here's how." (contrarian + number)
3. "Your landing page isn't broken. Your hero section is. Teardown:" (bold statement + open loop)
4. "We turned down a 50k build last week. Here's why." (open loop + counterintuitive)
5. "7 things I'd cut from your MVP scope today." (specific number)
6. "Stripe Checkout > custom checkout. Don't @ me." (contrarian)
7. "A founder paid us 12k. Here's what we shipped on Day 1." (case study open loop)
8. "If your site loads in 4s, you've already lost the lead." (bold stat-led)
9. "Reviewing [Brand]'s site: 3 wins, 2 fails." (before/after teardown)
10. "Our last 5 client builds had the same 1 mistake." (number + curiosity)

---

## 4. Recommended Content Strategy

### Weekly mix (revised based on research)

The previous Mon-Sun plan was an even split across 7 content types. Research is decisive: **case study teardowns are explicitly the top DM-converting format for agencies in 2026.** Re-weighting:

| Day | Content type | Platforms | Why |
|---|---|---|---|
| Mon | Framework / educational | LinkedIn + IG + TikTok | Save-driver. Sets the week. |
| Tue | **Case study (build)** | LinkedIn + IG + TikTok | Decision-maker scroll day; trust anchor. |
| Wed | Framework / educational | LinkedIn + IG + TikTok | Saves + shares loop. |
| Thu | **Case study (teardown of public site)** | LinkedIn + IG + TikTok | Generates "could you do mine?" DMs. |
| Fri | Hot take | LinkedIn + IG + TikTok | DM-trigger, comments. |
| Sat | Work example (visual flex) | IG + TikTok only (no LinkedIn) | LinkedIn weekend dead; TikTok loves Sat. |
| Sun | Result / win recap | IG + TikTok only | Low-effort momentum builder. |

**Mix in absolute terms:** 60% case study/teardown, 25% framework/educational, 15% hot take. Build-in-public is dropped (lower DM-to-view ratio for service firms).

### Cadence per platform
- **LinkedIn:** 5x/week (Mon-Fri), 10am-12pm UK time. Skip weekends.
- **Instagram:** 7x/week, 7-10pm.
- **TikTok:** 7x/week (PNG carousels) + 1-2 talking-head videos/week.

### Carousel design rules (from research)
- **Slide count: exactly 7 on LinkedIn.** (Reflow rules in CLAUDE.md handle the square/portrait differences.)
- **Slide 1 (hook):** deliver the promise in 5 words + tease the payoff. No clever artwork — clarity converts swipes.
- **Slide 2:** must justify the swipe (highest impact on completion rate, which the algorithm tracks).
- **One slide per carousel must be save-worthy** — checklist, framework, pricing math, scoping template, comparison grid. The kind of thing someone screenshots to refer back to.
- **Last slide:** single, specific CTA (see below).

### Caption rules (from research)
- **Length: 150-300 chars on carousels.** (Currently writing ~1,500 char monoliths.)
- **Structure:** Hook (210 chars) → Insight → CTA question or DM ask (100-200 chars).
- **No em dashes, en dashes, or double hyphens** (existing CLAUDE.md hard rule).
- **No links in body on LinkedIn — link goes in first comment.**

---

## 5. CTA Strategy — Vary by Funnel Stage

**Decision: vary CTAs by funnel stage. No universal closer.**

| Funnel stage | Content type | CTA pattern |
|---|---|---|
| Awareness | Hot take, work example | "Follow for more" — soft brand mention only |
| Curiosity | Framework, educational | "Save this" + "DM the word AUDIT for a free 5-min teardown" |
| Trust | Case study, result/win | "Want one of these? Book a 15-min call: fastlaunchmvp.com/call" |
| Direct response | Dedicated CTA closer slide | Calendly link, not homepage |

Per platform:
- **LinkedIn:** CTA in the caption's last line, link in first comment.
- **Instagram:** "DM the word X" beats links. One keyword per post.
- **TikTok:** CTA in caption + final slide only. Drive to bio link, never spoken URLs.

**The rule:** every post has exactly one CTA, picked from the table. No "and also follow me" double-asks.

---

## 6. Approval Flow — Discord Reaction (recommended)

The hard rule is no auto-posting without explicit approval. Recommended mechanism: **Discord emoji-reaction approval bot**.

### Why Discord reactions
You already live in Discord, no new tool, mobile-friendly, sub-5-second decision time. Beats email links (slow), dashboard buttons (need a UI), or /approve slash commands (need typing).

### Mechanics
1. Bot posts a single approval message per campaign:
   - Cover slide PNG (1080×1080) inline
   - Caption preview (first 220 chars + "…")
   - Platform + scheduled time
   - Slide count + thumbnail strip
2. Jack reacts: ✅ approve and post / 🔁 regenerate caption / ❌ kill / 📝 reply with edit notes.
3. Bot listens; ✅ triggers `post-linkedin.js` / `post-instagram.js`. ❌ archives. 🔁 regenerates only the caption (cheap loop). 📝 lets him edit inline.
4. **24-hour TTL** — if no reaction by post-time, bot DMs a reminder once, then auto-skips. Never auto-posts unapproved.

Time to decide: under 10 seconds from preview message. Anything more friction kills daily cadence.

---

## 7. Automation Roadmap to 95%

Ranked by impact-per-hour. Total: ~30 hours.

| # | Build | Hours | Why now |
|---|---|---|---|
| 1 | **Bug-fix bundle** — Posts API migration (LinkedIn) + IG version fix + approval gate + token-expiry check | 6h | Blockers. Fix before any auto-post. |
| 2 | **Approval bot + scheduler** (Discord react ✅/🔁/❌/📝 + cron) | 8h | Without it, "no auto-post without approval" is just an honour code. Daily cadence dies the first week you're busy. |
| 3 | **Analytics ingestor** → `metrics.json` per slug, +1h / +24h / +7d snapshots | 6h | Can't pick winners without data. Unblocks digest + variant testing. |
| 4 | **Caption generator** (Claude API, 3 variants, follows §9 + no em dashes, 150-300 chars) | 4h | Removes slowest manual step. Pairs with 🔁 reaction. |
| 5 | **Calendar auto-writer** (post-publish row append) | 1h | Tiny. Removes most-forgotten step. |
| 6 | **Sunday weekly digest** (top/worst post, save+DM rate vs last week, suggested next-week mix) | 5h | Closes the learning loop — system learns instead of just publishing. |

A/B variant testing deliberately deferred — not useful until n>40 posts.

### Architectural improvements (parallel, can be deferred)
- Extract `lib/` (canvas helpers, brand tokens, chrome, centering) — ~3h
- JSON slide manifest schema + generic renderer — ~6h
- Em-dash linter — ~30 min
- Catbox upload + ZIP + Discord delivery scripts — ~3h combined

---

## 8. Metrics to Track (per post, per platform)

Logged to `campaigns/<slug>/metrics.json`, refreshed at +1h / +24h / +7d.

**Universal:** slug, platform, post URL, posted_at, content_type, funnel_stage, cta_used, cover_theme (dark/light).

**LinkedIn:** impressions, unique_views, reactions, comments, reposts, **saves**, profile_clicks, **DMs_received_24h** (manually tagged for now).

**Instagram:** reach, impressions, **saves**, shares, profile_visits, **DM_keyword_hits**, follows_from_post.

**TikTok:** views, watch_time_avg, completion_rate, **profile_visits**, **bio_link_clicks**, shares, comments.

**Three optimisation signals (bold above):** saves (LI/IG), bio-link clicks (TikTok), DMs received within 24h (all). Vanity metrics (likes, impressions) get logged but never drive decisions.

---

## 9. Recommended Updates to CLAUDE.md

These would be encoded as hard rules so every future session inherits them automatically:

1. **Slide count: exactly 7 for LinkedIn carousels.**
2. **Caption length: 150-300 chars on carousels** (currently writing 1,500-char monoliths).
3. **CTA: vary by funnel stage. Specific DM keyword for IG. LinkedIn link in first comment.**
4. **Each carousel must include exactly one save-worthy slide** (checklist, framework, pricing math, scoping template).
5. **Cadence table per platform** — LinkedIn 5x/week (Mon-Fri), IG 7x/week, TikTok 7x/week + 1-2 talking-head videos.
6. **Content mix: 60% case study/teardown, 25% framework, 15% hot take.**
7. **Hook formulas:** must use one of the five proven 2026 patterns (counterintuitive claim / specific number / open loop / direct question / bold statement).
8. **Post from personal LinkedIn profile, not a company page.**

---

## 10. Implementation Sequencing — Recommended Order

If you green-light the full roadmap, here's the suggested order:

**Week 1 — foundations (≈12h)**
- Day 1 (~2h): Update CLAUDE.md with the new hard rules. Audit current `LINKEDIN_MEMBER_URN` (personal vs. company).
- Day 2 (~6h): Bug-fix bundle — LinkedIn Posts API migration, IG version fix, approval gate, token-expiry check.
- Day 3-4 (~4h): Caption generator (Claude API) + calendar auto-writer.

**Week 2 — automation core (≈14h)**
- Day 5-6 (~8h): Approval bot + scheduler (Discord).
- Day 7-8 (~6h): Analytics ingestor.

**Week 3 — learning loop (≈5h)**
- Day 9-10 (~5h): Sunday weekly digest.

**Ongoing — architectural cleanup (≈12h, in spare cycles)**
- Extract `lib/`, JSON slide manifest, em-dash linter, catbox/ZIP/Discord delivery scripts.

After Week 2 the system hits ~95% automation. Week 3 turns it from "publishing" into "learning."

---

## 11. Open Questions for Jack

1. **Approve the full roadmap?** Or pick a subset (e.g., bug fixes + approval bot only)?
2. **`LINKEDIN_MEMBER_URN` confirmed personal profile?** `urn:li:person:KSLgTCOLGM` looks personal (`person:` not `organization:`) — but worth eyeballing in your LinkedIn profile URL.
3. **Discord setup** — webhook only, or do you have a registered bot? Affects how the approval bot is built. (Webhook is simpler but can't read reactions; a proper bot needs hosting.)
4. **Calendly link** — what's the URL? Several CTAs reference "fastlaunchmvp.com/call" but that's a placeholder.
5. **Talking-head TikTok** — do you want me to design the format / shot list / script template now, or hold until carousels are fully automated?
6. **Token rotation** — when do you want to rotate the LinkedIn + Meta tokens that were exposed in this chat transcript? (Recommend: today, after we confirm dashboard credentials are working.)

---

## Appendix A — Sources

- The Ultimate Guide to LinkedIn Carousels in 2026 — CarouselMaker
- LinkedIn carousel best practices for B2B in 2026 — Oktopost
- LinkedIn Carousels: 3.7x Engagement Guide — Omnicreator
- LinkedIn Algorithm 2026 — DataSlayer
- LinkedIn Reach Dropped — Yepads
- LinkedIn Algorithm Depth Score — LinkBoost
- LinkedIn Algorithm — Sprout Social
- Best LinkedIn Post Length — ConnectSafely
- Ideal LinkedIn Post Length — WordCounterTool
- LinkedIn Post Length — Carouselli
- Instagram Carousel Strategy 2026 — TrueFuture
- Instagram Carousel Algorithm 2026 — TryMyPost
- Instagram Algorithm 2026 — Sprout Social
- TikTok Carousel Algorithm — PostWaffle
- TikTok Algorithm 2026 — Sprout Social
- Best Time to Post on TikTok — Buffer
- Best Times to Post on LinkedIn — Sprout Social
- How to Use TikTok for Digital Marketing 2026 — 12AM Agency
- LinkedIn Content Strategy 2026 — TrueFuture
