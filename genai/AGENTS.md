<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep category and picture content in shared data modules, with one reusable category view and an explicit flagship category route; this allows new collections without duplicating UI.
- Mock generation in a browser-safe pure function and keep artwork separate from Unicode text; real generation can replace the provider without changing browsing or editing.
- Export pictures through browser canvas after fonts and artwork load, using native file share when available and download fallback; no backend or signup is required for the prototype.
- Use route-level metadata for every shareable collection and semantic CSS tokens for all app colors.
- Gallery listings serve baked WebP files (Picture.file, src/assets/gallery/, descriptive filenames) so Google Images can index them; the editor still renders artwork + live text overlay from Picture.src/text. Bake new pictures via the /render/$id route and a Playwright capture at 540px with deviceScaleFactor 2, then ffmpeg to WebP.
