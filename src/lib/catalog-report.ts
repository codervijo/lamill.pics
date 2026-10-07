// Build/test-only: gallery fill status. Kept out of catalog.ts so the
// placeholder rows never ship in client JS.
import planned from '../data/gallery-placeholders.json';
import { catalogCategories, catalogPictures } from './catalog';

/** Per-category fill status vs. the data target (own pictures, not hub children). */
export function galleryGaps() {
 const placeholders = (planned.pictures as { category: string }[]);
 return catalogCategories.map(c => ({
  slug: c.slug, target: c.target,
  live: catalogPictures.filter(p => p.category === c.slug).length,
  placeholders: placeholders.filter(p => p.category === c.slug).length,
 }));
}

