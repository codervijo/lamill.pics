import sunrise from '@/assets/sunrise.jpg';
import tea from '@/assets/tea.jpg';
import fileMorningSunrise from '@/assets/gallery/good-morning-sunrise-hello-sunshine.webp';
import fileMorningTea from '@/assets/gallery/good-morning-tea-flowers-new-day.webp';
import fileMorningBlessing from '@/assets/gallery/christian-good-morning-psalm-118-24.webp';
import fileMorningKindness from '@/assets/gallery/good-morning-kindness-flowers.webp';
import fileMorningAmma from '@/assets/gallery/suprabatham-amma-malayalam-good-morning.webp';
import fileMorningHindi from '@/assets/gallery/suprabhat-hindi-good-morning-tea.webp';
import { pictures, promptText, type Picture } from './pics';
export const morningPictures: [Picture, Picture, Picture, Picture, Picture, Picture, Picture, Picture] = [pictures[0],
{id:'morning-sunrise',src:sunrise,title:'Golden sunrise good morning wish',text:'Hello, sunshine.',subtitle:'Today is full of possibilities.',category:'good-morning-images',tone:'dark',file:fileMorningSunrise},
{id:'morning-tea',src:tea,title:'Flowers and tea good morning image',text:'A little joy.\nA brand new day.',category:'good-morning-images',tone:'dark',file:fileMorningTea},pictures[6],
{id:'morning-blessing',src:sunrise,title:'Christian morning blessing Psalm 118:24',text:'This is the day\nthe Lord has made.',subtitle:'Psalm 118:24',category:'christian/good-morning',tone:'dark',file:fileMorningBlessing},
{...pictures[0],id:'morning-kindness',title:'A morning filled with kindness',text:'Start with kindness.',subtitle:'Good morning, beautiful soul.',file:fileMorningKindness},
{...pictures[6],id:'morning-amma',title:'Good morning Amma in Malayalam',text:'സുപ്രഭാതം അമ്മേ',subtitle:'സ്നേഹത്തോടെ, എന്നും',file:fileMorningAmma},
{id:'morning-hindi',src:tea,title:'Hindi morning wish with flowers',text:'सुप्रभात',subtitle:'आपका दिन शुभ हो',category:'good-morning-images',tone:'dark',file:fileMorningHindi}];
export const allPictures = [...pictures, ...morningPictures.filter(p => !pictures.some(x=>x.id===p.id))];
export function mockGenerate(prompt: string): Picture[] {
 const category = /birthday/i.test(prompt) ? 'birthday-wishes' : /friends|group/i.test(prompt) ? 'dp/friends' : /islamic|arabic/i.test(prompt) ? 'dp/islamic' : /love|couple/i.test(prompt) ? 'dp/couple' : /night/i.test(prompt) ? 'good-night-images' : 'good-morning-images';
 const primary = allPictures.find(p=>p.category===category) ?? pictures[0];
 const sources = category === 'good-morning-images' ? [pictures[0],morningPictures[1],morningPictures[2],pictures[6]] : [primary,{...primary,placement:'bottom' as const}, {...primary,subtitle:'Made with a little love.'}, {...primary,placement:'top' as const}];
 return sources.map((p,i) => ({...p,id:`creation-${i}`,text:promptText(prompt),subtitle: /118:24/.test(prompt) ? 'Psalm 118:24' : undefined,title:`${prompt} · choice ${i+1}`,variant:i}));
}
