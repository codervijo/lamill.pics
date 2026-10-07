// v1.B–v1.E regression checks: data integrity, stable image URLs, picture
// pages, image sitemap, social tags, image dimensions, analytics language.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import data from '../data/gallery.json';
import planned from '../data/gallery-placeholders.json';
import { assertNoPathCollisions, categoryPath, categoryPictures, catalogCategories, catalogPictures, imagePath, jpegPath, picturePath, sitemapImages, LANGUAGES } from '../lib/catalog';
import { galleryGaps } from '../lib/catalog-report';
import { detectLanguage } from '../lib/track';

const ART = ['flowers', 'friends', 'islamic', 'birthday', 'couple', 'night', 'sunrise', 'tea'];

describe('gallery data', () => {
  it('every live picture is complete and its WebP exists at the stable path', () => {
    for (const p of catalogPictures) {
      for (const k of ['id', 'slug', 'category', 'title', 'text', 'tone'] as const) expect(p[k], `${p.id}.${k}`).toBeTruthy();
      expect(Object.keys(LANGUAGES)).toContain(p.language);
      expect(ART).toContain(p.art);
      expect(catalogCategories.map(c => c.slug)).toContain(p.category);
      expect(existsSync(join('public', imagePath(p))), imagePath(p)).toBe(true);
    }
  });
  it('slugs are URL-safe and picture paths never collide with category/language pages', () => {
    for (const p of catalogPictures) expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(() => assertNoPathCollisions()).not.toThrow();
  });
  it('every category has its own card description', () => {
    const cards = catalogCategories.map(c => c.card);
    for (const c of cards) expect(c).toBeTruthy();
    expect(new Set(cards).size).toBe(cards.length);
  });
  it('placeholders never reach the catalog or the sitemap', () => {
    const ids = new Set(planned.pictures.map(p => p.id));
    expect(catalogPictures.some(p => ids.has(p.id))).toBe(false);
    expect((data.pictures as { status: string }[]).every(p => p.status === 'live')).toBe(true);
    const urls = [...sitemapImages().values()].flat();
    expect(urls.every(u => /^https:\/\/lamill\.pics\/images\/.+\.webp$/.test(u))).toBe(true);
  });
  it('each category is planned up to its target', () => {
    for (const g of galleryGaps()) expect(g.live + g.placeholders, g.slug).toBe(g.target);
  });
});

describe('analytics language detection', () => {
  it('maps script to language', () => {
    expect(detectLanguage('സുപ്രഭാതം')).toBe('ml');
    expect(detectLanguage('सुप्रभात')).toBe('hi');
    expect(detectLanguage('السلام عليكم')).toBe('ar');
    expect(detectLanguage('Good morning')).toBe('en');
  });
});

// Built-output checks — run after `pnpm build` (make test builds first).
const dist = 'dist';
const htmlFiles = (dir: string): string[] => readdirSync(dir).flatMap(f => {
  const p = join(dir, f); return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
});
describe.skipIf(!existsSync(join(dist, 'index.html')))('built site', () => {
  const sitemap = existsSync(join(dist, 'sitemap-0.xml')) ? readFileSync(join(dist, 'sitemap-0.xml'), 'utf8') : '';
  it('no hashed gallery images in /_astro', () => {
    expect(readdirSync(join(dist, '_astro')).filter(f => f.endsWith('.webp'))).toEqual([]);
  });
  it('sitemap has image entries and never a query-string URL', () => {
    expect(sitemap).toContain('<image:image>');
    expect(sitemap).not.toMatch(/<loc>[^<]*\?/);
    expect(readFileSync(join(dist, 'robots.txt'), 'utf8')).toMatch(/Sitemap: https:\/\/lamill\.pics\/sitemap-index\.xml/);
  });
  it('every picture page is built, in the sitemap, with og:image, schema and JPEG twin', () => {
    for (const p of catalogPictures) {
      const html = readFileSync(join(dist, picturePath(p), 'index.html'), 'utf8');
      expect(sitemap).toContain(`<loc>https://lamill.pics${picturePath(p)}</loc>`);
      expect(html).toContain(`<meta property="og:image" content="https://lamill.pics${jpegPath(p)}">`);
      expect(html).toContain('<meta name="twitter:image"');
      expect(html).toContain('"@type":"ImageObject"');
      expect(html).toContain('"@type":"BreadcrumbList"');
      expect(html).toMatch(/<h1[^>]*>/);
      expect(existsSync(join(dist, jpegPath(p)))).toBe(true);
    }
  });
  it('categories without art are noindex and absent from the sitemap; the rest are indexable and listed', () => {
    for (const c of catalogCategories) {
      const html = readFileSync(join(dist, categoryPath(c.slug), 'index.html'), 'utf8');
      const empty = categoryPictures(c.slug).length === 0;
      expect(html.includes('name="robots" content="noindex'), c.slug).toBe(empty);
      expect(sitemap.includes(`<loc>https://lamill.pics${categoryPath(c.slug)}</loc>`), c.slug).toBe(!empty);
    }
  });
  it('every page has og:image and every <img> has explicit width and height', () => {
    for (const f of htmlFiles(dist)) {
      const html = readFileSync(f, 'utf8');
      if (!html.includes('name="robots" content="noindex')) expect(html, f).toContain('property="og:image"');
      for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
        expect(img, f).toMatch(/\bwidth="\d+"/);
        expect(img, f).toMatch(/\bheight="\d+"/);
      }
    }
  });
});
