// v1.B–v1.E regression checks: data integrity, stable image URLs, picture
// pages, image sitemap, social tags, image dimensions, analytics language.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import data from '../data/gallery.json';
import planned from '../data/gallery-placeholders.json';
import { assertNoPathCollisions, categoryPath, categoryPictures, catalogCategories, catalogPictures, imagePath, inCategory, jpegPath, pageTitle, parentCategory, picturePath, relatedCategories, relatedPictures, sitemapImages, LANGUAGES } from '../lib/catalog';
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
  it('every page has exactly one robots meta; indexable ones allow large image previews', () => {
    for (const f of htmlFiles(dist)) {
      const tags = readFileSync(f, 'utf8').match(/<meta name="robots"[^>]*>/g) ?? [];
      expect(tags.length, f).toBe(1);
      if (!tags[0]!.includes('noindex')) expect(tags[0], f).toContain('max-image-preview:large');
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

// v1.G — page copy: every indexable page has its own query-led heading, SERP
// title/description, prose and FAQ, and nothing is shared boilerplate.
const withArt = catalogCategories.filter(c => categoryPictures(c.slug).length > 0);
const unique = (values: string[], what: string) => expect(new Set(values).size, what).toBe(values.length);
describe('page copy', () => {
  it('categories with art have a full, page-specific set of copy', () => {
    for (const c of withArt) {
      expect(pageTitle(c.title).length, `${c.slug} title`).toBeLessThanOrEqual(60);
      expect(c.title, `${c.slug} title ≠ h1`).not.toBe(c.h1);
      expect(c.description.length, `${c.slug} description`).toBeLessThanOrEqual(155);
      for (const other of [c.intro, c.answer, c.card]) expect(c.description, c.slug).not.toBe(other);
      expect(c.answer.split(/(?<=[.!?”])\s+/).length, `${c.slug} answer`).toBeGreaterThanOrEqual(2);
      expect(c.sections.length, `${c.slug} sections`).toBeGreaterThanOrEqual(2);
      expect(c.faq.length, `${c.slug} faq`).toBeGreaterThanOrEqual(4);
      expect(c.faq.length, `${c.slug} faq`).toBeLessThanOrEqual(6);
      for (const slug of c.related) expect(catalogCategories.map(x => x.slug), `${c.slug} related`).toContain(slug);
      expect(c.related, c.slug).not.toContain(c.slug);
    }
  });
  it('no title, description, heading, section heading, FAQ or generator copy is repeated across categories', () => {
    unique(catalogCategories.map(c => c.h1), 'h1');
    unique(catalogCategories.map(c => c.title), 'title');
    unique(catalogCategories.map(c => c.description), 'description');
    unique(catalogCategories.map(c => c.generator.heading), 'generator heading');
    unique(catalogCategories.map(c => c.generator.example), 'generator example');
    unique(catalogCategories.flatMap(c => c.sections.map(s => s.heading)), 'section heading');
    unique(catalogCategories.flatMap(c => c.sections.flatMap(s => s.body)), 'paragraph');
    unique(catalogCategories.flatMap(c => c.faq.map(f => f.q)), 'faq question');
    unique(withArt.flatMap(c => c.faq.map(f => f.a)), 'faq answer');
  });
  it('every picture has its own heading, description and paragraph', () => {
    for (const p of catalogPictures) {
      expect(pageTitle(p.h1).length, `${p.id} title`).toBeLessThanOrEqual(60);
      expect(p.description.length, `${p.id} description`).toBeLessThanOrEqual(155);
      expect(p.about.length, `${p.id} about`).toBeGreaterThan(120);
      expect(p.h1, p.id).not.toBe(p.title);
    }
    unique(catalogPictures.map(p => p.h1), 'picture h1');
    unique(catalogPictures.map(p => p.description), 'picture description');
    unique(catalogPictures.map(p => p.about), 'picture about');
  });
  it('related pictures start with the same category, then the same cluster', () => {
    const peace = catalogPictures.find(p => p.id === 'peace')!;
    expect(relatedPictures(peace).slice(0, 2).every(p => p.category.startsWith('dp/'))).toBe(true);
    const bloom = catalogPictures.find(p => p.id === 'morning-bloom')!;
    expect(relatedPictures(bloom).every(p => inCategory(p, 'good-morning-images'))).toBe(true);
    for (const p of catalogPictures) expect(relatedPictures(p).map(r => r.id)).not.toContain(p.id);
  });
  it('a nested category links up to its hub, and the hub links down to every leaf', () => {
    for (const c of catalogCategories) {
      const parent = parentCategory(c.slug);
      if (!parent) continue;
      expect(relatedCategories(c.slug)[0]!.slug, c.slug).toBe(parent.slug);
      expect(relatedCategories(parent.slug).map(x => x.slug), parent.slug).toContain(c.slug);
    }
  });
});

describe.skipIf(!existsSync(join(dist, 'index.html')))('built page copy', () => {
  const page = (path: string) => readFileSync(join(dist, path, 'index.html'), 'utf8');
  const text = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, '\'').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
  it('every indexable category page renders its heading, answer, prose and FAQ, with matching schema', () => {
    for (const c of withArt) {
      const html = page(categoryPath(c.slug)); const body = text(html);
      expect(html.match(/<h1\b/g)?.length, c.slug).toBe(1);
      expect(html, c.slug).toContain(`<title>${pageTitle(c.title).replace(/&/g, '&amp;')}</title>`);
      for (const type of ['CollectionPage', 'BreadcrumbList', 'FAQPage']) expect(html, `${c.slug} ${type}`).toContain(`"@type":"${type}"`);
      expect(body, c.slug).toContain(c.answer);
      for (const s of c.sections) { expect(body, c.slug).toContain(s.heading); for (const t of s.body) expect(body, c.slug).toContain(t); }
      for (const f of c.faq) { expect(body, c.slug).toContain(f.q); expect(body, c.slug).toContain(f.a); expect(html, c.slug).toContain(JSON.stringify(f.q)); }
      expect(body, c.slug).toContain(c.generator.heading);
    }
  });
  it('every picture page renders its own heading and paragraph', () => {
    for (const p of catalogPictures) {
      const body = text(page(picturePath(p)));
      expect(body, p.id).toContain(p.h1);
      expect(body, p.id).toContain(p.about);
    }
  });
  it('no two indexable pages share a title or a meta description', () => {
    const pages = htmlFiles(dist).map(f => readFileSync(f, 'utf8')).filter(h => !h.includes('name="robots" content="noindex'));
    unique(pages.map(h => h.match(/<title>([\s\S]*?)<\/title>/)![1]!), 'title');
    unique(pages.map(h => h.match(/<meta name="description" content="([^"]*)"/)![1]!), 'meta description');
  });
});
