# Growth Log — lamill.pics

> **What this file is for:** an honest, append-only log of growth experiments
> on this site — what was tried, what was measured, what happened. The data
> source is GSC; this file narrates *why*. Future-you (or future-Claude)
> reads this when deciding what to try next, both on this site and on
> related sister sites.

## How to use this (workflow — re-read this when you forget)

**Add an entry whenever you do something growth-relevant.** That includes:
shipping new content, structural SEO changes (sitemap, schema, redirects,
internal linking), tech changes that affect crawl/indexing, marketing
pushes, backlink campaigns. *Not* every code commit — just things you'd
want to point at when GSC numbers move (or fail to).

**Each entry is a hypothesis you can be wrong about.** Commit to a
measurable KPI and an observation window before acting — otherwise "did
this work?" is just a feeling.

### Lifecycle of one entry

1. **Day of action** — append a new dated H2 with `Status: active`, the
   hypothesis, the KPI you'll watch, current baseline numbers, what you
   did, and the date to review (default: today + 28 days, matching GSC's
   reporting window).
2. **Review day** — pull current GSC numbers, compute delta vs baseline.
   Fill in **Result** and **Learning**. Set **Status** to `shipped` (worked,
   keep going), `failed` (didn't pay off, abandon), or extend the review
   another window if results are ambiguous.
3. **Never rewrite older entries.** Wrong hypotheses are the most valuable
   data — they tell you what NOT to repeat on the next site. Append, don't
   edit.

### Where to get the numbers

```bash
cd ~/work/projects/sites/portfolio && make run ARGS="gsc sync"
```

Then read the row for `lamill.pics`. Or pull from
https://search.google.com/search-console directly.

### Format

```
## YYYY-MM-DD — <one-line hypothesis or action>
- **Status:** active | testing | shipped | failed | abandoned
- **Hypothesis:** <what you're betting will work — only on initial / new-bet entries>
- **KPI:** <what GSC metric / query / page>
- **Baseline:** <numbers at start>
- **Action:** <what was done; 1-2 lines>
- **Result:** <numbers after window; "TBD — review YYYY-MM-DD" until then>
- **Learning:** <why it worked / didn't; what to try next; "TBD" until reviewed>
```

---

## 2026-10-06 — Search demand for ready-made DP and greeting images is enormous and…
- **Status:** active
- **Hypothesis:** Search demand for ready-made DP and greeting images is enormous and served by weak sites (KD 0 on queries like "dp for whatsapp," "islamic dp," "attitude dp" and "good morning images"), while create-intent queries like "happy birthday cake with name" and "birthday wishes with photo" are also low-difficulty. A site with a steady supply of original, well-typeset, multilingual images, each one personalizable in a single tap, can outrank existing galleries and convert some browsers into creators. Growth comes from Google and Google Images first, then from WhatsApp shares of personalized images, especially group icons and occasion wishes seen by whole groups. The hypothesis fails if pages aren't indexed or impressions stay flat after 6 weeks, or if under 3% of visitors personalize or generate. That would make this a pure ad-supported gallery rather than a product.
- **KPI:** any GSC traffic — clicks, impressions, indexed-page count
- **Baseline:** 0 clicks / 0 impressions (just deployed)
- **Action:** project scaffolded via `portfolio new bootstrap`; first deploy pending. After deploy: verify in GSC as `sc-domain:lamill.pics` and submit the sitemap.
- **Result:** TBD — review 2026-11-03
- **Learning:** TBD

## 2026-10-06 — Stable image URLs + per-image landing pages get gallery images indexed in Google Images
- **Status:** active
- **Hypothesis:** Hashed `/_astro/*.webp` URLs changed every rebuild, so Google Images never kept an image. With stable `/images/<category>/<slug>.webp` URLs, one picture page per image (ImageObject + BreadcrumbList schema), and an image sitemap, the images and picture pages get indexed and start drawing Google Images impressions.
- **KPI:** GSC indexed-page count (target: the 14 picture pages); GSC impressions with search type = Image; CHECK_147 indexed ratio
- **Baseline:** 0/10 top URLs indexed (CHECK_147, 2026-10-06); 0 impressions
- **Action:** v1.B–v1.E (PRD): stable image paths, 14 picture pages, JPEG og:image, `<image:image>` sitemap entries, crawlable language-filter links, analytics events.
- **Result:** TBD — review 2026-11-03
- **Learning:** TBD
