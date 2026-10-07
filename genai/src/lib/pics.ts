import flowers from '@/assets/morning-flowers.jpg';
import friends from '@/assets/friends.jpg';
import islamic from '@/assets/islamic.jpg';
import birthday from '@/assets/birthday.jpg';
import couple from '@/assets/couple.jpg';
import night from '@/assets/night.jpg';
import fileMorningBloom from '@/assets/gallery/good-morning-flowers-fresh-start.webp';
import fileOurKind from '@/assets/gallery/friends-group-dp-our-kind-of-crazy.webp';
import fileBirthdayLove from '@/assets/gallery/happy-birthday-wishes-flowers.webp';
import filePeace from '@/assets/gallery/islamic-dp-peace-begins-with-faith.webp';
import fileLoveHome from '@/assets/gallery/couple-dp-you-me-always.webp';
import fileNightDream from '@/assets/gallery/good-night-sweet-dreams-moon.webp';
import fileMalayalamMorning from '@/assets/gallery/suprabatham-malayalam-good-morning-flowers.webp';
import fileSmallSteps from '@/assets/gallery/motivational-quote-small-steps.webp';

export type Picture = { id: string; src: string; title: string; text: string; subtitle?: string | undefined; category: string; tone: 'light' | 'dark'; placement?: 'top' | 'bottom'; variant?: number; file?: string };
export type Category = { slug: string; name: string; short: string; intro: string; image: string };
export const categories: [Category, Category, Category, Category, Category, Category, Category, Category, Category, Category] = [
 { slug: 'good-morning-images', name: 'Good Morning Images', short: 'Good Morning', intro: 'A little sunshine for someone’s day. Beautiful morning wishes to download, share, or make your own.', image: flowers },
 { slug: 'dp', name: 'WhatsApp DP', short: 'WhatsApp DP', intro: 'A little picture. A lot of personality. Find your next profile picture.', image: couple },
 { slug: 'dp/friends', name: 'Friends Group DP', short: 'Friends', intro: 'For your favourite people and your never-quiet group chat.', image: friends },
 { slug: 'dp/couple', name: 'Couple DP', short: 'Love & Couples', intro: 'Little pictures for a love that feels like home.', image: couple },
 { slug: 'dp/islamic', name: 'Islamic DP', short: 'Islamic', intro: 'Peaceful images and heartfelt wishes for moments of faith.', image: islamic },
 { slug: 'christian/good-morning', name: 'Christian Images', short: 'Christian', intro: 'Start the day with gratitude, hope and a little blessing.', image: flowers },
 { slug: 'birthday-wishes', name: 'Birthday Wishes', short: 'Birthday', intro: 'Make their special day a little more wonderful.', image: birthday },
 { slug: 'good-night-images', name: 'Good Night Images', short: 'Good Night', intro: 'Send a little peace before the day comes to an end.', image: night },
 { slug: 'dp/attitude', name: 'Attitude DP', short: 'Attitude', intro: 'Be yourself. Let your picture do the talking.', image: friends },
 { slug: 'motivational-images', name: 'Motivational Images', short: 'Quotes', intro: 'A few words can make a world of difference.', image: night },
];
export const pictures: [Picture, Picture, Picture, Picture, Picture, Picture, Picture, Picture] = [
 {id:'morning-bloom',src:flowers,title:'A fresh start, a beautiful day',text:'Good morning',subtitle:'A fresh start. A beautiful day.',category:'good-morning-images',tone:'dark',file:fileMorningBloom},
 {id:'our-kind',src:friends,title:'Friends that feel like family',text:'Our kind of crazy.',subtitle:'Our kind of family.',category:'dp/friends',tone:'light',placement:'bottom',file:fileOurKind},
 {id:'birthday-love',src:birthday,title:'Birthday wishes with love',text:'Happy Birthday!',subtitle:'Here’s to a little more magic.',category:'birthday-wishes',tone:'dark',file:fileBirthdayLove},
 {id:'peace',src:islamic,title:'A peaceful Islamic greeting',text:'Peace begins\nwith faith.',subtitle:'Alhamdulillah, always.',category:'dp/islamic',tone:'dark',file:filePeace},
 {id:'love-home',src:couple,title:'You feel like home',text:'You. Me. Always.',category:'dp/couple',tone:'light',placement:'bottom',file:fileLoveHome},
 {id:'night-dream',src:night,title:'Good night and sweet dreams',text:'Good night',subtitle:'Let tomorrow take care of itself.',category:'good-night-images',tone:'light',file:fileNightDream},
 {id:'malayalam-morning',src:flowers,title:'Malayalam good morning flowers',text:'സുപ്രഭാതം',subtitle:'നല്ലൊരു ദിവസം ആശംസിക്കുന്നു',category:'good-morning-images',tone:'dark',file:fileMalayalamMorning},
 {id:'small-steps',src:night,title:'Keep going motivational quote',text:'Small steps.\nBeautiful beginnings.',category:'motivational-images',tone:'light',file:fileSmallSteps},
];
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
