# Prompt History — lamill.pics

<!-- Append new prompts at the bottom, newest last. Format:

## YYYY-MM-DD [optional title]
> <prompt text or short summary>

The dated H2 (`## YYYY-MM-DD`) is what `portfolio project check` parses
to surface "last AI prompt" per project. Keep entries append-only.
-->

## 2026-10-06 — scaffolded via portfolio new bootstrap

> Created project skeleton. Stack chosen, scaffolding written, git initialized.

## 2026-10-06 — v1.A–v1.E audit fixes (stable image URLs, picture pages, gallery depth, analytics)

> Audit brief: hashed gallery image URLs break Google Images; thin categories; no
> per-image landing pages; no og:image; repeated card text; no image sitemap;
> unverified analytics. Placed into PRD v1.A (decisions) → v1.B–v1.E and built:
> data-driven `/images/<category>/<slug>.webp`, `/<category>/<slug>/` picture
> pages with ImageObject + BreadcrumbList, JPEG twins for og:image/download,
> image sitemap, crawlable language filter links, per-category card text,
> placeholder slots (data-only), 8 tracked events via GA4 (`PUBLIC_GA_ID`).

## 2026-10-06 — v1.D noindex art-less categories; repo rename; v1.F favicon + robots; first push

> `/dp/attitude/` (no art) → `noindex, follow` + out of sitemap, data-driven.
> GitHub repo renamed `lamill` → `lamill.pics` (operator, in the dashboard);
> origin updated, CHECK_040 passing. v1.F: brand sparkle favicon (CHECK_060),
> robots meta with `max-image-preview:large` (CHECK_075), literal og:image in
> index.astro (CHECK_076). Pushed `a7e7d45`; live checks passed.
> Open: `PUBLIC_GA_ID`, review draft card text, 286 placeholder slots, GSC
> review 2026-11-03.

## 2026-10-11 — v1.G content depth (per write-lamill-seo-page); www redirect fix

> Audit against the SEO-page skill: all 24 indexable pages thin and templated
> (68–147 words, captions as H1s, shared generator heading, tagline reused as
> meta description, no FAQ). Placed as v1.G and built: per-category answer,
> sections, FAQ + `FAQPage`, `CollectionPage` + `BreadcrumbList` on every
> category, per-category generator copy, query-led picture H1s with their own
> description and paragraph, related pictures by category → cluster, hub
> breadcrumbs, home direct-answer paragraph. `good-morning-images.astro` folded
> into `[...slug].astro`. Target queries from operator-authored sources only
> (Ahrefs out of units). Separately: `www.lamill.pics` 522 → 301 to apex via
> the portfolio CHECK_150 fixer (CF token needed Zone → Single Redirect: Edit).
> Open: keyword pull for volume/KD, 3 categories with no query on record,
> growth-log entry when v1.G deploys.

