import flowersImage from '@/assets/morning-flowers.jpg';
import friendsImage from '@/assets/friends.jpg';
import islamicImage from '@/assets/islamic.jpg';
import birthdayImage from '@/assets/birthday.jpg';
import coupleImage from '@/assets/couple.jpg';
import nightImage from '@/assets/night.jpg';
import sunriseImage from '@/assets/sunrise.jpg';
import teaImage from '@/assets/tea.jpg';
import lionImage from '@/assets/lion.jpg';
import friendsSunsetImage from '@/assets/friends-sunset.jpg';
import cakeImage from '@/assets/cake.jpg';
import nilavilakkuImage from '@/assets/nilavilakku.jpg';
import mosqueDuskImage from '@/assets/mosque-dusk.jpg';
import backwatersBoatImage from '@/assets/backwaters-boat.jpg';
import teaTumblerImage from '@/assets/tea-tumbler.jpg';
import hibiscusImage from '@/assets/hibiscus.jpg';
import mistyForestImage from '@/assets/misty-forest.jpg';
import lakeDockImage from '@/assets/lake-dock.jpg';
import coupleHandsTeaImage from '@/assets/couple-hands-tea.jpg';
import villageNightImage from '@/assets/village-night.jpg';
import moonPalmsImage from '@/assets/moon-palms.jpg';
import hikerDawnImage from '@/assets/hiker-dawn.jpg';
import balloonsGiftImage from '@/assets/balloons-gift.jpg';
import cupcakeImage from '@/assets/cupcake.jpg';
import eagleImage from '@/assets/eagle.jpg';
import godBlessFieldImage from '@/assets/god-bless-field.jpg';
import hillCrossDawnImage from '@/assets/hill-cross-dawn.jpg';
import bibleCoffeeImage from '@/assets/bible-coffee.jpg';
import keralaChurchDawnImage from '@/assets/kerala-church-dawn.jpg';
import lanternWindowImage from '@/assets/lantern-window.jpg';
import moonLakeImage from '@/assets/moon-lake.jpg';
import moonlitMeadowImage from '@/assets/moonlit-meadow.jpg';
import paddyNightImage from '@/assets/paddy-night.jpg';
import latteHeartsImage from '@/assets/latte-hearts.jpg';
import beachSunsetCoupleImage from '@/assets/beach-sunset-couple.jpg';
import twoSwingsImage from '@/assets/two-swings.jpg';
import rainMugsImage from '@/assets/rain-mugs.jpg';
import threeFriendsHillImage from '@/assets/three-friends-hill.jpg';
import fourSneakersImage from '@/assets/four-sneakers.jpg';
import fiveHandsImage from '@/assets/five-hands.jpg';
import girlsBeachImage from '@/assets/girls-beach.jpg';
import friendsJumpSunsetImage from '@/assets/friends-jump-sunset.jpg';
import campfireFriendsImage from '@/assets/campfire-friends.jpg';
import twoBicyclesImage from '@/assets/two-bicycles.jpg';
import rainUmbrellaCoupleImage from '@/assets/rain-umbrella-couple.jpg';
import heartHandsSunsetImage from '@/assets/heart-hands-sunset.jpg';
import lovebirdsBranchImage from '@/assets/lovebirds-branch.jpg';
import roseBalconyNightImage from '@/assets/rose-balcony-night.jpg';
import harbourNightImage from '@/assets/harbour-night.jpg';
import keralaCourtyardNightImage from '@/assets/kerala-courtyard-night.jpg';
import mountainLakeStarsImage from '@/assets/mountain-lake-stars.jpg';
import mountainEagleDawnImage from '@/assets/mountain-eagle-dawn.jpg';
import lighthouseDawnImage from '@/assets/lighthouse-dawn.jpg';
import windowFlowersSunriseImage from '@/assets/window-flowers-sunrise.jpg';
import keralaSunrisePaddyImage from '@/assets/kerala-sunrise-paddy.jpg';
import chocolateCakeSparklersImage from '@/assets/chocolate-cake-sparklers.jpg';
import giftConfettiImage from '@/assets/gift-confetti.jpg';
import bouquetBalloonsImage from '@/assets/bouquet-balloons.jpg';
import cupcakeRowImage from '@/assets/cupcake-row.jpg';
import munnarTeaSunriseImage from '@/assets/munnar-tea-sunrise.jpg';
import jasmineDewImage from '@/assets/jasmine-dew.jpg';
import { altText, captionText, catalogCategories, catalogPictures, imagePath, type CatalogCategory, type CatalogPicture, type Language } from './catalog';

// Background art (site assets, Astro-hashed) — live text is typeset over these.
export const art: Record<string, string> = { flowers: flowersImage.src, friends: friendsImage.src, islamic: islamicImage.src, birthday: birthdayImage.src, couple: coupleImage.src, night: nightImage.src, sunrise: sunriseImage.src, tea: teaImage.src, lion: lionImage.src, 'friends-sunset': friendsSunsetImage.src, cake: cakeImage.src, nilavilakku: nilavilakkuImage.src, 'mosque-dusk': mosqueDuskImage.src, 'backwaters-boat': backwatersBoatImage.src, 'tea-tumbler': teaTumblerImage.src, hibiscus: hibiscusImage.src, 'misty-forest': mistyForestImage.src, 'lake-dock': lakeDockImage.src, 'couple-hands-tea': coupleHandsTeaImage.src, 'village-night': villageNightImage.src, 'moon-palms': moonPalmsImage.src, 'hiker-dawn': hikerDawnImage.src, 'balloons-gift': balloonsGiftImage.src, cupcake: cupcakeImage.src, eagle: eagleImage.src, 'god-bless-field': godBlessFieldImage.src, 'hill-cross-dawn': hillCrossDawnImage.src, 'bible-coffee': bibleCoffeeImage.src, 'kerala-church-dawn': keralaChurchDawnImage.src, 'lantern-window': lanternWindowImage.src, 'moon-lake': moonLakeImage.src, 'moonlit-meadow': moonlitMeadowImage.src, 'paddy-night': paddyNightImage.src, 'latte-hearts': latteHeartsImage.src, 'beach-sunset-couple': beachSunsetCoupleImage.src, 'two-swings': twoSwingsImage.src, 'rain-mugs': rainMugsImage.src, 'three-friends-hill': threeFriendsHillImage.src, 'four-sneakers': fourSneakersImage.src, 'five-hands': fiveHandsImage.src, 'girls-beach': girlsBeachImage.src, 'friends-jump-sunset': friendsJumpSunsetImage.src, 'campfire-friends': campfireFriendsImage.src, 'two-bicycles': twoBicyclesImage.src, 'rain-umbrella-couple': rainUmbrellaCoupleImage.src, 'heart-hands-sunset': heartHandsSunsetImage.src, 'lovebirds-branch': lovebirdsBranchImage.src, 'rose-balcony-night': roseBalconyNightImage.src, 'harbour-night': harbourNightImage.src, 'kerala-courtyard-night': keralaCourtyardNightImage.src, 'mountain-lake-stars': mountainLakeStarsImage.src, 'mountain-eagle-dawn': mountainEagleDawnImage.src, 'lighthouse-dawn': lighthouseDawnImage.src, 'window-flowers-sunrise': windowFlowersSunriseImage.src, 'kerala-sunrise-paddy': keralaSunrisePaddyImage.src, 'chocolate-cake-sparklers': chocolateCakeSparklersImage.src, 'gift-confetti': giftConfettiImage.src, 'bouquet-balloons': bouquetBalloonsImage.src, 'cupcake-row': cupcakeRowImage.src, 'munnar-tea-sunrise': munnarTeaSunriseImage.src, 'jasmine-dew': jasmineDewImage.src };

export type Picture = { id: string; src: string; title: string; text: string; subtitle?: string | undefined; category: string; tone: 'light' | 'dark'; placement?: 'top' | 'bottom'; variant?: number; file?: string; slug?: string; language?: Language; alt?: string; caption?: string; h1?: string; description?: string; about?: string };
export type Category = Omit<CatalogCategory, 'art' | 'target'> & { image: string };

function artSrc(key: string): string { const src = art[key]; if (!src) throw new Error(`gallery.json: unknown art key "${key}"`); return src; }
export function toPicture(p: CatalogPicture): Picture {
 return { id: p.id, slug: p.slug, src: artSrc(p.art), title: p.title, text: p.text, subtitle: p.subtitle, category: p.category, tone: p.tone, placement: p.placement, language: p.language, file: imagePath(p), alt: altText(p), caption: captionText(p), h1: p.h1, description: p.description, about: p.about };
}
export const categories: Category[] = catalogCategories.map(({ art: key, target: _target, ...c }) => ({ ...c, image: artSrc(key) }));
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
