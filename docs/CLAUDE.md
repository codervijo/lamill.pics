# CLAUDE.md — lamill.pics

Per-project orientation for Claude. Read this first when picking up
work on this site. Index of conventions, deferred decisions, and
non-features that aren't obvious from the code or git history.

## Project

Mobile-first SEO image gallery + generator for WhatsApp DPs and greeting
images (Malayalam, Hindi, Arabic, English), for WhatsApp-native family-group
admins. Astro (static) + React islands + pnpm on Cloudflare Workers; Makefile
forwards to the sites/* workspace and the central builder. `AI_AGENTS.md` is
authoritative, especially § Operator notes.

Key mechanics (non-obvious from a skim):
- `src/data/gallery.json` drives everything: image paths
  (`/images/<category>/<slug>.webp`, stable, in `public/`), picture pages
  (`/<category>/<slug>/`), the image sitemap, filters, card text.
- Page copy (v1.G) is data too: each category in `gallery.json` carries `query`,
  `h1`, `title`, `description`, `answer`, `sections`, `faq`, `generator` and
  `related`; each picture carries `h1`, `description`, `about`. Tests fail on
  any title, description, section heading, paragraph or FAQ repeated across
  pages. Adding a picture or category means writing its copy.
- "Add a name or message" **replaces** the picture's words (it does not append),
  and the generator is still a mock ("Sample creations"). Copy must say so.
- `astro.config.mjs` imports `src/lib/catalog.ts` (pure, no asset imports)
  for the image sitemap, and writes a `.jpg` copy of each gallery WebP at
  build time (`og:image` + no-JS download).
- Portfolio SEO checks (CHECK_075/076) parse `src/pages/index.astro` *source*,
  so tags there must be literal, not emitted by a component.
- New art (v1.H): `scripts/compose_picture.py <spec.json>` (`uv run`) typesets
  text over textless art, mirroring `picture-export.ts`, and writes
  `src/assets/<art>.jpg` + `public/images/<category>/<slug>.webp`. Specs with
  prompts live in `scripts/specs/`; raw 2K PNGs in `art-raw/` (gitignored).
  A new art key also goes in `pics.ts` `art` and the test's `ART` list.
  Generate via treg `replicate.image-gen.nano-banana-pro` — reapi's file host
  is blocked by the home router.
- The `sites1` container runs as root: `pnpm add`/install can make
  `pnpm-lock.yaml` root-owned — `chown 1000:1000` it after.

## Commands

```bash
# Build / dev (forwards to the parent Makefile)
make deps           # install deps via the central builder
make dev            # local dev server
make build          # production build → dist/

# Test (per-stack — adjust as needed)
make test           # if a test suite is wired in

# Deploy
git push            # Cloudflare Pages auto-builds on push to main
```

## Conventions

  - Build path: this project's `Makefile` → `../Makefile` (parent
    workspace) → `~/work/projects/builder/` (central builder).
  - Stack: pnpm-only. No `package-lock.json` / `bun.lockb` / `yarn.lock`.
  - Deploy: Cloudflare Pages via `wrangler.jsonc`. No `_redirects`
    SPA fallback (uses CF's `not_found_handling` instead).

## Heading hygiene

**Before adding any section, subsection, or heading to a Markdown
file, output the file's current heading outline first:**

```bash
grep -nE '^#+ ' path/to/file.md
```

Then confirm — in the chat — that the planned new heading's:

1. **Depth** (`#`, `##`, `###`, …) is the intended depth, not
   accidentally one level too shallow.
2. **Label** doesn't collide with existing headings — no duplicate
   `## 1. <title>`, no `### N.X` subsection labels that look like
   `vN.X` phase identifiers.

Only after that confirmation, write.

Applies especially to long-lived docs: `docs/prd.md`, `AI_AGENTS.md`,
`docs/architecture.md`, `docs/CLAUDE.md`.

**Why:** structural drift is invisible in any single editing session
— it only becomes obvious in the aggregate, by which time the doc is
hard to fix. The pre-edit outline ritual catches collisions and depth
mistakes at the point of writing, not at quarterly cleanup time.

## Deferred decisions

<Things deliberately *not* shipped. Append entries with rationale so
future Claude sessions don't re-propose them.>

- **2026-10-06 — Placeholder gallery slots aren't rendered.** 286 rows in
  `src/data/gallery-placeholders.json` stay data-only (no tile, page or
  sitemap entry) until real art exists, so no thin or empty pages get indexed.
- **2026-10-06 — Language pages only at ≥ 6 images** (`MIN_LANGUAGE_PAGE`).
  Below that, the filter is an in-page `?lang=` link and the canonical stays
  on the category.
- **2026-10-06 — No style filter yet.** It needs a `style` field in
  `gallery.json` first.
- **2026-10-06 — Art-less categories are `noindex, follow`** (none today;
  `/dp/attitude/` got art in v1.H) and out of the sitemap. This lifts automatically when art lands.
- **2026-10-11 — Category copy names specific pictures.** Single-image
  categories describe their one picture ("The picture here shows…"). Reword
  when more art lands in that category.
- **Known, unfixed (pre-existing):** generated "choices" on the home and
  category generators show the source picture's baked WebP (original text),
  not the prompt text. `mockGenerate` keeps `file`; fixing it changes the visuals.
