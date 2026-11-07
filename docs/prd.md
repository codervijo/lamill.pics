---
project: lamill.pics
prd_version: 1
project_version: v1.G
status: live
owner: Vijo
last_updated: 2026-11-06
---

# lamill.pics — PRD

## 1. Problem

WhatsApp-native users search Google and Google Images for ready-made DPs and
greeting images ("good morning images malayalam", "islamic dp", "happy birthday
cake with name"). The sites that rank are weak, and the text is often baked badly
into the image or breaks in non-Latin scripts.

## 2. Users

Everyday WhatsApp users in India, the Gulf and the South Asian and Arab diaspora.
ICP: a 45–65-year-old family-group admin who sends good morning and festival images
every day and wants to pick → add a name → send in under 30 seconds. See
`AI_AGENTS.md` § ICP.

## 3. Goals & non-goals

**Goals:**
- Within 6 weeks, validate that low-KD image-intent pages get indexed and gain impressions.
- At least 8% of visitors personalize or generate a picture.

**Non-goals:**
- Signup or accounts (never required to browse, personalize, download or share).
- Image-model-rendered text (all text is real Unicode over the artwork).
- Pages for keywords with KD > 20 unless the operator approves.

## 4. Versions

Two-level versioning convention (canonical: `sites/portfolio/AI_AGENTS.md`):

- `vN` = major capability tier; SemVer-MAJOR semantics.
- `vN.X` = phase letter within a tier; internal slicing.

| Version | Theme | Acceptance |
|---|---|---|
| v0 | scaffold | local builds, CF wrangler.jsonc + public/_headers in place, repo initialized |
| v1 | indexable image gallery | every gallery image has a stable URL, its own landing page and an image-sitemap entry; galleries hold 30–60 images; events are measurable |
| v2 | shared image pipeline (imagemill) | lamill.pics art is generated through the portfolio's shared imagemill pipeline (`~/work/projects/droyfun/imagemill`), the same one other sites use; lamill keeps typesetting (`compose_picture.py` ↔ `picture-export.ts`), copy and its own sitemap / schema |

## 5. Phases

| Phase | Theme | Features | Status |
|---|---|---|---|
| **v0.A** | scaffolded | `portfolio new bootstrap` ran; standard files written; git initialized | ✅ |
| **v1.A** | planning / decisions-lock | audit findings placed into v1.B–v1.E; decisions logged in §6 (2026-10-06) | ✅ |
| **v1.B** | stable image URLs + image sitemap | gallery WebPs served from `/images/<category>/<slug>.webp` (hash-free, data-driven; Astro hashing kept for site assets); `<image:image>` entries in the sitemap; `?create=true` never listed; robots.txt → sitemap | ✅ live 2026-10-06 (`a7e7d45`) — awaiting operator validation |
| **v1.C** | picture pages + social previews | `/<category>/<image-slug>/` per image: H1, large WebP, caption, alt, "Add a name or message", Download (1080×1080 PNG), Share (Web Share with file → wa.me fallback), Make your own, related pictures; ImageObject + BreadcrumbList schema; gallery tiles link to the page; site-wide `og:image` / `twitter:image` (lead image on category pages, the picture itself on picture pages) | ✅ live 2026-10-06 (`a7e7d45`) — awaiting operator validation |
| **v1.D** | gallery depth | data layer supports 30–60 images per category; placeholder entries flagged in data and not rendered; crawlable language filters; per-category card description in data, replacing "Find your little favourite" | ✅ live 2026-10-06 (`a7e7d45`) — awaiting operator validation |
| **v1.E** | analytics events | `generate`, `chip_tap`, `image_open`, `add_name`, `download`, `share`, `filter`, `make_own_cta`, each with `category` + `language`; GA4 via `PUBLIC_GA_ID`; console log in dev | ✅ live 2026-10-06 (`a7e7d45`) — awaiting operator validation |
| **v1.F** | conformance: favicon + meta robots | brand favicon (sparkle mark, brand green) replacing the Lovable default `favicon.ico` + scaffold `favicon.svg` (CHECK_060); `<meta name="robots">` on every indexable page with `max-image-preview:large`, and literal `og:image` in `index.astro` (CHECK_075/076 parse page source) | ✅ live 2026-10-06 (`a7e7d45`) — awaiting operator validation |
| **v1.G** | content depth (per `write-lamill-seo-page`) | target query validated per indexable page from keyword data before any copy (never invented; KD ≤ 20); per-category prose in `gallery.json`: direct-answer intro, page-specific substance, 4–6 real FAQ (visible + `FAQPage`); picture-page H1 / title / description led by the query, caption kept as caption, titles ≤ 60 chars; per-category generator heading + example prompt, replacing the shared "Make their morning a little more personal." / "Good morning Amma…" boilerplate; meta description written separately from the on-page tagline; `CollectionPage` + `BreadcrumbList` on every category page; related pictures drawn from the same category / cluster first; home page gets a direct-answer paragraph | ✅ shipped 2026-10-11 — awaiting operator validation; target queries taken from operator-authored sources, not re-validated (see §6) |
| **v1.H** | art pipeline + gallery fill | textless AI art (model never renders text) → real Unicode text typeset over it (ml / hi / ar / en) → 1080×1080 WebP at `/images/<category>/<slug>.webp` → `gallery.json` entry with unique copy (h1, description, about, alt, caption); script-driven and repeatable; 5-picture pilot first to lock model, style and per-image cost; then fill placeholders toward 30–60 per category, unlocking `/<category>/<language>/` pages at ≥ 6 images; art and text kept as separate layers so the generator can re-typeset | 🚧 pilot live 2026-10-21 (`2cfdd51`, 5 pictures); batch 2 committed (`09489a3`, 12 pictures, 31 total); batch 3 built 2026-11-06 (12 pictures aimed at KD ≤ 20 clusters: Christian / God ×4, good night ×4, couple ×4; 43 total, suite green); family-group art waits for v1.I's `/dp/family-group/`. **Next (operator-approved 2026-11-06): 24 pictures per run** — `scripts/gen_batch.py` (one command: submit all via treg in parallel → poll → download → art check → compose, `✓ ✗ ↷` per picture, cost cap; no lamill-only review sheet); `scripts/check_art.py` (flags a flat band at the top edge or a busy text zone, auto re-roll once); shared prompt template with the composition rules; category copy describes themes + counts instead of naming every picture; batch 4 built 2026-11-07 (`gen_batch.py`, 24/24 passed the art check first time, $3.60; friends group 6, couple 4, good night 4, Christian 4, birthday 4, Malayalam good morning 2; 67 total, suite green; Malayalam lines operator-approved) |
| **v1.I** | search surface | from the 2026-11-06 keyword pull (§6): low-KD sub-pages where a cluster has ≥ 6 pictures (e.g. `/dp/family-group/`, `/good-night-images/blessings/`, `/christian/good-night/`), each with its own query, copy, FAQ and schema; retarget category H1 / title to KD ≤ 20 variants where the head term is KD > 20 (operator approves each); fix `/birthday-wishes/` `discovered_not_indexed` (internal links from home); image-search CTR/position work (pos ~47) | ⏳ queued 2026-11-06 |
| **v1.J** | Tamil + Kannada | keyword pull for ta / kn queries (KD ≤ 20) to pick the first categories; `ta` + `kn` in `Language` / `LANGUAGES` (`/tamil/`, `/kannada/`); script detection in `track.ts` + `compose_picture.py`; Noto Sans Tamil / Kannada for baked pictures **and** as web fonts in `picture-export.ts` + site CSS so in-browser personalization renders correctly; ≥ 6 good-morning pictures per language to unlock `/good-morning-images/tamil/` + `/kannada/` (~12 pictures); language pages get their own intro + FAQ (also fixes the Malayalam page reusing category copy verbatim); every ta / kn picture ships with a `needs_review` flag in data (see §6) | ⏳ queued 2026-11-06 |
| **v1.K** | Telugu | reuse v1.J's script support: `te`, Noto Sans Telugu, ≥ 6 good-morning pictures → `/good-morning-images/telugu/`; check intent first (Telugu "suprabhatam" searches are mostly the Venkateswara hymn); `needs_review` flag as v1.J | ⏳ queued 2026-11-06 |
| **v2.A** | planning / decisions-lock: shared imagemill pipeline | probe: 6 batch-3 prompts on imagemill's `gpt-image-2.5-flare` at a square size (~$0.07 estimate), side-by-side with nano-banana-pro, operator judges quality; if it passes, decide the imagemill-side changes (measured square-size pricing; art-only export of full-res originals into `art-raw/`, no JSON-LD / sitemap) and place them in imagemill's own PRD; spec → imagemill CSV bridge; 2 candidates per picture; one review / contact sheet shared across all sites (imagemill's), not a per-site one | ⏳ queued 2026-11-06 |

## 6. Open questions

- *(append-only log; mark answered with date but never delete)*
- **Which repo does Cloudflare build from?** Brief said `codervijo/lamill-magic`; local `origin` = `codervijo/lamill` (exists, at `da8954f`); `lamill-magic` doesn't resolve. Working in `codervijo/lamill`. — answered 2026-10-06, needs operator confirmation in the CF dashboard
- **Picture-page URLs vs sub-category / language URLs** (`/dp/<pic>/` vs `/dp/friends/`; `/good-morning-images/<pic>/` vs `/good-morning-images/malayalam/`). Keep `/<category>/<image-slug>/`; reserve category and language slugs and fail the build/test on any collision. — answered 2026-10-06
- **Placeholder gallery entries on a live site.** They live in data with `status: 'placeholder'`. They are never rendered, never get a picture page and never enter the sitemap until art exists, so no thin or empty tiles get indexed. — answered 2026-10-06
- **Crawlable filters.** Filter chips are real `<a href>` links. A language gets its own static page `/<category>/<language>/` (as in the content strategy) only once it has real images, so there are no empty filter pages. Style filter waits on a `style` field in data. — answered 2026-10-06
- **Analytics provider.** GA4 via `PUBLIC_GA_ID` (fleet pattern, e.g. calcengine.site); inert until the ID is set. — answered 2026-10-06
- **1080×1080 download.** Client-side canvas PNG (existing `picture-export.ts`), so an added name is included; the baked 1080×1080 WebP stays the indexable image. — answered 2026-10-06
- **v1.G target queries — where they came from.** Ahrefs had 0 API units (trial), so no fresh volume/KD pull was possible. Category headings use the operator-authored queries already on record: `good morning images`, `friends group dp`, `islamic dp`, `birthday wishes with name` (`lamill.toml`), `dp for whatsapp` (`docs/growth.md`), `couple dp`, `attitude dp` (`AI_AGENTS.md` § Content strategy). Three categories have **no** query on record (`query: null` in `gallery.json`): `/christian/good-morning/`, `/good-night-images/`, `/motivational-images/` — their headings describe the page and are unvalidated. Picture-page headings describe the picture under its category's query and are also unvalidated. Volume and KD for all of them still need a keyword pull. — open 2026-10-11
- **Keyword pull (2026-11-06, SE Ranking via treg, India DB).** Done; raw ideas for 9 seeds. Current category queries are mostly **KD > 20**: `good morning images` 82, `dp for whatsapp` 86, `couple dp` 92, `attitude dp` 73, `birthday wishes with name` 61, `good morning images malayalam` 76, `good night images` 95, `motivational images` 100, `islamic dp` 87; only `friends group dp` 24 is near the bar. KD ≤ 20 on record: `couple dp for whatsapp` (610/mo, KD 10), `family group dp` (80, KD 11), `malayalam good night images` (260, KD 10), `good morning amma images` (90, KD 10), `christian good morning images` (KD 9). SE Ranking undercounts the long tail: it reports `christian good morning images` at 10/mo while GSC logged 60 web impressions on it in 28 days. Whether to retarget category H1s to KD ≤ 20 variants is open. — open 2026-11-06
- **Tamil / Kannada / Telugu text review.** No native reviewer on hand (operator reviews Malayalam). Ship with a `needs_review` flag on each ta / kn / te picture in `gallery.json`; flagged pictures are listed for a later native pass and their wording is reworked when reviewed. Prefer short standard greetings (காலை வணக்கம், ಶುಭೋದಯ) over free-form lines. — answered 2026-11-06
- **English language pages duplicate their category.** At ≥ 6 English pictures a `/<category>/english/` page appears with the category's heading and copy verbatim. Operator chose (2026-11-07): English pages canonicalise to the category and stay out of the sitemap (`ownCanonical` in `catalog.ts`); other languages keep their own canonical. Own copy per language page is v1.J. — answered 2026-11-07
- **`/good-morning-images/` route.** The explicit `good-morning-images.astro` page was folded into `[...slug].astro` so every category shares one template, schema and copy path. Same URL, same canonical. — answered 2026-10-11
