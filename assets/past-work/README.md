# Past-work asset library

Reusable mockups and screenshots from Fast Launch's past projects. Used as
visual content in TikTok / IG / LinkedIn carousels and Shorts.

## Structure

One folder per project, kebab-case slug:

```
assets/past-work/
├── README.md            # this file
├── index.md             # human-readable catalog, kept in sync with folders
├── clausekit/
│   ├── homepage-full.png
│   ├── hero.png
│   └── meta.yaml
├── aramas/
│   ├── ...
│   └── meta.yaml
└── ...
```

## meta.yaml schema

Each project folder has a `meta.yaml` so future content briefs can grep for
relevant projects by industry / style / feature:

```yaml
name: ClauseKit
slug: clausekit
url: https://clausekit.lemon.vercel.app
industry: legal-tech / freelancer-tools
audience: UK freelancers
style: clean, green, calm, trustworthy
year: 2026
key_features:
  - comparison-table
  - pricing-cards
  - empty-state-dashboard
  - quick-start-tiles
hero_color: '#1B4332'
notes: Built in 6 days. Strong hero photography. Side-by-side comparison gold.
files:
  homepage-full.png: full-page screenshot, 1920x6969
  dashboard.png: logged-in admin view, 1920x919
```

## Adding a new project

1. Create the folder: `assets/past-work/<slug>/`
2. Drop screenshots (PNG preferred, full-page renders are most useful).
3. Write a `meta.yaml` per the schema above.
4. Append a row to `index.md` so the catalog stays current.

## Use in content generation

When building a campaign, the renderer can pull mockups from this library by
slug. For carousels that show "the kind of work we do", round-robin through
projects matching the chosen industry / style filter. See `campaigns/*/make-*.js`
for examples.
