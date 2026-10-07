// astro.config.mjs
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath as toPath } from 'node:url';
import sharp from 'sharp';
import { emptyCategoryPaths, galleryImageFiles, sitemapImages } from './src/lib/catalog.ts';

// Image sitemap: each gallery/picture page lists its stable /images/... URLs.
const pageImages = sitemapImages();
// Categories without art are noindex (see [...slug].astro) — keep them out too.
const emptyCategories = emptyCategoryPaths();

// Writes a 1080×1080 JPEG next to every gallery WebP in dist/ (same stable
// path, .jpg) — og:image for WhatsApp previews + the no-JS download file.
const galleryJpegs = {
  name: 'lamill-gallery-jpegs',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const out = toPath(dir);
      for (const { webp, jpeg } of galleryImageFiles()) {
        await sharp(out + webp.slice(1)).flatten({ background: '#ffffff' }).jpeg({ quality: 86, mozjpeg: true }).toFile(out + jpeg.slice(1));
      }
      logger.info(`✓ ${galleryImageFiles().length} gallery JPEGs written`);
    },
  },
};

export default defineConfig({
  site: 'https://lamill.pics',
  // trailingSlash: 'always' — directory format serves /<page>/ and
  // @astrojs/sitemap lists /<page>/, so a page's <link rel="canonical">
  // MUST also end in a slash. A canonical of /<page> (no slash) 308-redirects
  // to /<page>/ — Google then can't settle on a canonical and the page comes
  // back "URL is unknown to Google". Make it explicit so every page's
  // canonical matches its served URL. Enforced by CHECK_161.
  trailingSlash: 'always',
  integrations: [
    react(),
    galleryJpegs,
    // /render/<id>/ is an internal artwork-baking surface (noindex).
    // Query-string URLs (e.g. /?create=true) are never pages, so never listed.
    sitemap({
      filter: (page) => !page.includes('/render/') && !page.includes('?') && !emptyCategories.has(new URL(page).pathname),
      serialize: (item) => {
        const images = pageImages.get(new URL(item.url).pathname);
        return images?.length ? { ...item, img: images.map((url) => ({ url })) } : item;
      },
    }),
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    // Ported code imports via the `@/` alias (shadcn convention).
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  },
});
