import { catalog, pictures, promptText, type Picture } from './pics';
import { categoryPictures } from './catalog';
const ids = (slug: string) => new Set(categoryPictures(slug).map(p => p.id));
export const galleryFor = (slug: string): Picture[] => { const set = ids(slug); return catalog.filter(p => set.has(p.id)); };
export const morningPictures: Picture[] = galleryFor('good-morning-images');
export const allPictures: Picture[] = catalog;
export function mockGenerate(prompt: string): Picture[] {
 const category = /birthday/i.test(prompt) ? 'birthday-wishes' : /friends|group/i.test(prompt) ? 'dp/friends' : /islamic|arabic/i.test(prompt) ? 'dp/islamic' : /love|couple/i.test(prompt) ? 'dp/couple' : /night/i.test(prompt) ? 'good-night-images' : 'good-morning-images';
 const primary = allPictures.find(p=>p.category===category) ?? pictures[0]!;
 const sources = category === 'good-morning-images' ? [pictures[0]!,morningPictures[1]!,morningPictures[2]!,pictures[6]!] : [primary,{...primary,placement:'bottom' as const}, {...primary,subtitle:'Made with a little love.'}, {...primary,placement:'top' as const}];
 // Generated choices have no picture page of their own.
 return sources.map((p,i) => ({...p,slug:undefined,id:`creation-${i}`,text:promptText(prompt),subtitle: /118:24/.test(prompt) ? 'Psalm 118:24' : undefined,title:`${prompt} · choice ${i+1}`,variant:i}));
}
