// Pure gallery catalog — no asset imports, so astro.config.mjs (sitemap) and
// tests can load it. Gallery images are served from stable, hash-free URLs
// (/images/<category>/<slug>.webp, files under public/images/) so Google Images
// keeps the same URL across rebuilds. Site assets stay Astro-hashed.
import data from '../data/gallery.json';

export const SITE = 'https://lamill.pics';

export type Language = 'en' | 'ml' | 'hi' | 'ar';
export type Status = 'live' | 'placeholder';
export type CatalogPicture = {
 id: string; slug: string; category: string; also_in?: string[]; language: Language; status: Status;
 art: string; title: string; text: string; subtitle?: string; tone: 'light' | 'dark'; placement?: 'top' | 'bottom';
 alt?: string; caption?: string;
};
export type CatalogCategory = { slug: string; name: string; short: string; intro: string; card: string; target: number; art: string };

export const catalogCategories = data.categories as CatalogCategory[];
// Placeholders are data-only until art exists: never rendered, no picture page, not in the sitemap.
export const catalogPictures = (data.pictures as CatalogPicture[]).filter(p => p.status === 'live');

export const imagePath = (p: { category: string; slug: string }) => `/images/${p.category}/${p.slug}.webp`;
// JPEG twin of every gallery WebP, written at build time (astro.config.mjs) —
// og:image for WhatsApp previews and the no-JS 1080×1080 download.
export const jpegPath = (p: { category: string; slug: string }) => `/images/${p.category}/${p.slug}.jpg`;
export const picturePath = (p: { category: string; slug: string }) => `/${p.category}/${p.slug}/`;
export const categoryPath = (slug: string) => `/${slug}/`;

// A category also shows its children's pictures (/dp/ hub ⊇ /dp/friends/ …).
export const inCategory = (p: CatalogPicture, slug: string) => p.category === slug || p.category.startsWith(`${slug}/`) || !!p.also_in?.includes(slug);
export const categoryPictures = (slug: string) => catalogPictures.filter(p => inCategory(p, slug));

// Alt/caption default to data the operator already approved (title + the
// picture's own words); set `alt` / `caption` in gallery.json to override.
const oneLine = (t: string) => t.replace(/\s*\n\s*/g, ' ');
export const altText = (p: CatalogPicture) => p.alt ?? `${p.title}: “${oneLine(p.text)}${p.subtitle ? ` — ${p.subtitle}` : ''}”`;
export const captionText = (p: CatalogPicture) => p.caption ?? p.title;

export const LANGUAGES: Record<Language, { name: string; slug: string }> = {
 en: { name: 'English', slug: 'english' }, ml: { name: 'Malayalam', slug: 'malayalam' }, hi: { name: 'Hindi', slug: 'hindi' }, ar: { name: 'Arabic', slug: 'arabic' },
};

// A language gets its own static page (/<category>/<language>/) only once it has
// enough real pictures to not be thin. Below that, the filter is in-page only.
export const MIN_LANGUAGE_PAGE = 6;
export const categoryLanguages = (slug: string): Language[] =>
 (Object.keys(LANGUAGES) as Language[]).filter(l => categoryPictures(slug).some(p => p.language === l));
export const languagePages = (slug: string): Language[] =>
 categoryLanguages(slug).filter(l => categoryPictures(slug).filter(p => p.language === l).length >= MIN_LANGUAGE_PAGE);
export const languagePath = (slug: string, l: Language) => `/${slug}/${LANGUAGES[l].slug}/`;

/** Same category first, then the rest of the catalog; never the picture itself. */
export function relatedPictures(p: CatalogPicture, n = 6): CatalogPicture[] {
 const rest = catalogPictures.filter(x => x.id !== p.id);
 const same = rest.filter(x => inCategory(x, p.category));
 return [...same, ...rest.filter(x => !same.includes(x))].slice(0, n);
}

/** Picture pages share URL space with categories (/dp/<pic>/ vs /dp/friends/)
 *  and future language pages (/<category>/malayalam/). Fail loudly on overlap. */
export function assertNoPathCollisions(): void {
 const reserved = new Set<string>(catalogCategories.map(c => categoryPath(c.slug)));
 for (const c of catalogCategories) for (const l of Object.values(LANGUAGES)) reserved.add(`/${c.slug}/${l.slug}/`);
 const seen = new Set<string>();
 for (const p of catalogPictures) {
  const path = picturePath(p);
  if (reserved.has(path)) throw new Error(`gallery.json: picture "${p.id}" path ${path} collides with a category/language page`);
  if (seen.has(path)) throw new Error(`gallery.json: duplicate picture path ${path}`);
  seen.add(path);
 }
}

/** Absolute image URLs per page path, for the image sitemap. */
export function sitemapImages(): Map<string, string[]> {
 const map = new Map<string, string[]>();
 for (const c of catalogCategories) map.set(categoryPath(c.slug), categoryPictures(c.slug).map(p => SITE + imagePath(p)));
 for (const c of catalogCategories) for (const l of languagePages(c.slug)) map.set(languagePath(c.slug, l), categoryPictures(c.slug).filter(p => p.language === l).map(p => SITE + imagePath(p)));
 for (const p of catalogPictures) map.set(picturePath(p), [SITE + imagePath(p)]);
 return map;
}

export const galleryImageFiles = () => catalogPictures.map(p => ({ webp: imagePath(p), jpeg: jpegPath(p) }));
