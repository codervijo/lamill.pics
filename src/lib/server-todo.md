# Server code dropped in the tanstack-start → Astro (static) port

Astro here builds `output: 'static'`; none of the following translates. The
site has no backend dependency — generation is mocked client-side
(`mockGenerate` in `gallery-data.ts`) and export/share run in the browser.

- TODO: `genai/src/server.ts` — TanStack Start server entry wrapping SSR with an
  h3-swallowed-500 → HTML error page fallback. Not needed for static output;
  Cloudflare serves `404.html` for missing routes.
- TODO: `genai/src/start.ts` — request middleware (error page + CSRF filter for
  server functions). No server functions exist; nothing to protect.
- TODO: `genai/src/lib/error-capture.ts`, `genai/src/lib/error-page.ts` —
  server-side error capture / HTML error page. Dropped with `server.ts`.
- TODO: `genai/src/lib/lovable-error-reporting.ts` and the root
  `ErrorComponent` ("This page didn't load" / "Try again") — Lovable editor
  telemetry + TanStack router error boundary. No equivalent wired; add a React
  error boundary around the islands if runtime errors need a friendly fallback.
- TODO: `genai/src/router.tsx`, `genai/src/routeTree.gen.ts` and the
  `QueryClientProvider` in `__root.tsx` — router/react-query plumbing. No
  component used react-query, so it was dropped entirely.
- TODO: `genai/src/test/*` — tests target the TanStack route tree / jsdom;
  not ported. `pics.test.ts` logic could be re-added under `src/__tests__/`.
- Note: `/?create=true` was a TanStack `validateSearch` param; it's now read
  client-side in `Home` (`components/pics/experience.tsx`).
