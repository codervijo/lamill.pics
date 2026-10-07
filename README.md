# lamill.pics

Turn any thought into a picture: WhatsApp DPs, group icons, good morning and
birthday images in Malayalam, Hindi, Arabic and English. Text is real Unicode
over the artwork. No signup. Live at https://lamill.pics/.

## Develop

Runs inside the `sites/` workspace's docker container (`make buildsh` from
`sites/`), then from this directory:

```bash
make run     # dev server
make test    # pnpm install + build + vitest
```

## Add a gallery picture

1. Put the 1080×1080 WebP at `public/images/<category>/<slug>.webp`.
2. Add (or fill and move a placeholder row into) `src/data/gallery.json` with
   `status: "live"`.
3. `make test`. It checks the file exists, the slug is safe, and the paths don't collide.

## Docs

`AI_AGENTS.md` (authoritative) · `docs/prd.md` (phases) · `docs/growth.md`
(experiments) · `docs/Prompts.md` (prompt log).
