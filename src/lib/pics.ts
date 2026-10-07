import flowersImage from '@/assets/morning-flowers.jpg';
import friendsImage from '@/assets/friends.jpg';
import islamicImage from '@/assets/islamic.jpg';
import birthdayImage from '@/assets/birthday.jpg';
import coupleImage from '@/assets/couple.jpg';
import nightImage from '@/assets/night.jpg';
import sunriseImage from '@/assets/sunrise.jpg';
import teaImage from '@/assets/tea.jpg';
import { altText, captionText, catalogCategories, catalogPictures, imagePath, type CatalogPicture, type Language } from './catalog';

// Background art (site assets, Astro-hashed) — live text is typeset over these.
export const art: Record<string, string> = { flowers: flowersImage.src, friends: friendsImage.src, islamic: islamicImage.src, birthday: birthdayImage.src, couple: coupleImage.src, night: nightImage.src, sunrise: sunriseImage.src, tea: teaImage.src };

export type Picture = { id: string; src: string; title: string; text: string; subtitle?: string | undefined; category: string; tone: 'light' | 'dark'; placement?: 'top' | 'bottom'; variant?: number; file?: string; slug?: string; language?: Language; alt?: string; caption?: string };
export type Category = { slug: string; name: string; short: string; intro: string; card: string; image: string };

function artSrc(key: string): string { const src = art[key]; if (!src) throw new Error(`gallery.json: unknown art key "${key}"`); return src; }
export function toPicture(p: CatalogPicture): Picture {
 return { id: p.id, slug: p.slug, src: artSrc(p.art), title: p.title, text: p.text, subtitle: p.subtitle, category: p.category, tone: p.tone, placement: p.placement, language: p.language, file: imagePath(p), alt: altText(p), caption: captionText(p) };
}
export const categories: Category[] = catalogCategories.map(c => ({ slug: c.slug, name: c.name, short: c.short, intro: c.intro, card: c.card, image: artSrc(c.art) }));
export const catalog: Picture[] = catalogPictures.map(toPicture);
const byId = (id: string): Picture => { const p = catalog.find(x => x.id === id); if (!p) throw new Error(`gallery.json: missing picture "${id}"`); return p; };
// Home page "All pictures" set (presentation order).
export const pictures: Picture[] = ['morning-bloom','our-kind','birthday-love','peace','love-home','night-dream','malayalam-morning','small-steps'].map(byId);
export function pageHead(title: string, description: string, path = '/') { return {meta:[{title:`${title} — LaMill Pics`},{name:'description',content:description},{property:'og:title',content:`${title} — LaMill Pics`},{property:'og:description',content:description},{property:'og:type',content:'website'},{property:'og:url',content:path},{name:'twitter:card',content:'summary_large_image'}],links:[{rel:'canonical',href:path}]}; }
export function isRTL(text:string) { return /[\u0600-\u06ff]/.test(text); }
export function promptText(prompt:string):string {
 const quoted = prompt.match(/["“]([^"”]+)["”]/); if(quoted?.[1]) return quoted[1];
 if (/Malayalam/i.test(prompt) && /morning/i.test(prompt)) return /amma/i.test(prompt) ? 'സുപ്രഭാതം അമ്മേ' : 'സുപ്രഭാതം';
 if (/Christian/i.test(prompt) && /118:24/.test(prompt)) return 'This is the day\nthe Lord has made.';
 if (/birthday/i.test(prompt)) return 'Happy Birthday!';
 if (/morning/i.test(prompt)) return /amma/i.test(prompt) ? 'Good morning, Amma' : 'Good morning';
 if (/friends|group/i.test(prompt)) return /Malayalam/i.test(prompt) ? 'നമ്മുടെ സൗഹൃദം' : 'Better together.';
 if (/islamic/i.test(prompt)) return 'Peace begins with faith.';
 return (prompt.split(',')[0] ?? prompt).trim();
}
