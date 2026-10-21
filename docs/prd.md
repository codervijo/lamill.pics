---
project: lamill.pics
prd_version: 1
project_version: v1.G
status: live
owner: Vijo
last_updated: 2026-10-11
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
| **v1.H** | art pipeline + gallery fill | textless AI art (model never renders text) → real Unicode text typeset over it (ml / hi / ar / en) → 1080×1080 WebP at `/images/<category>/<slug>.webp` → `gallery.json` entry with unique copy (h1, description, about, alt, caption); script-driven and repeatable; 5-picture pilot first to lock model, style and per-image cost; then fill placeholders toward 30–60 per category, unlocking `/<category>/<language>/` pages at ≥ 6 images; art and text kept as separate layers so the generator can re-typeset | 🚧 pilot built 2026-10-20 (5 pictures, suite green, not pushed) — awaiting operator review of art + copy |

## 6. Open questions

- *(append-only log; mark answered with date but never delete)*
- **Which repo does Cloudflare build from?** Brief said `codervijo/lamill-magic`; local `origin` = `codervijo/lamill` (exists, at `da8954f`); `lamill-magic` doesn't resolve. Working in `codervijo/lamill`. — answered 2026-10-06, needs operator confirmation in the CF dashboard
- **Picture-page URLs vs sub-category / language URLs** (`/dp/<pic>/` vs `/dp/friends/`; `/good-morning-images/<pic>/` vs `/good-morning-images/malayalam/`). Keep `/<category>/<image-slug>/`; reserve category and language slugs and fail the build/test on any collision. — answered 2026-10-06
- **Placeholder gallery entries on a live site.** They live in data with `status: 'placeholder'`. They are never rendered, never get a picture page and never enter the sitemap until art exists, so no thin or empty tiles get indexed. — answered 2026-10-06
- **Crawlable filters.** Filter chips are real `<a href>` links. A language gets its own static page `/<category>/<language>/` (as in the content strategy) only once it has real images, so there are no empty filter pages. Style filter waits on a `style` field in data. — answered 2026-10-06
- **Analytics provider.** GA4 via `PUBLIC_GA_ID` (fleet pattern, e.g. calcengine.site); inert until the ID is set. — answered 2026-10-06
- **1080×1080 download.** Client-side canvas PNG (existing `picture-export.ts`), so an added name is included; the baked 1080×1080 WebP stays the indexable image. — answered 2026-10-06
- **v1.G target queries — where they came from.** Ahrefs had 0 API units (trial), so no fresh volume/KD pull was possible. Category headings use the operator-authored queries already on record: `good morning images`, `friends group dp`, `islamic dp`, `birthday wishes with name` (`lamill.toml`), `dp for whatsapp` (`docs/growth.md`), `couple dp`, `attitude dp` (`AI_AGENTS.md` § Content strategy). Three categories have **no** query on record (`query: null` in `gallery.json`): `/christian/good-morning/`, `/good-night-images/`, `/motivational-images/` — their headings describe the page and are unvalidated. Picture-page headings describe the picture under its category's query and are also unvalidated. Volume and KD for all of them still need a keyword pull. — open 2026-10-11
- **`/good-morning-images/` route.** The explicit `good-morning-images.astro` page was folded into `[...slug].astro` so every category shares one template, schema and copy path. Same URL, same canonical. — answered 2026-10-11
