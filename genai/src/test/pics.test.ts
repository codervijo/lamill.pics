import { describe, expect, it } from 'vitest';
import { mockGenerate, morningPictures } from '@/lib/gallery-data';
import { isRTL, promptText, categories } from '@/lib/pics';

describe('LaMill Pics generation', () => {
  it('returns four choices with separately rendered Malayalam text', () => {
    const choices = mockGenerate('Good morning Amma, Malayalam, flowers');
    expect(choices).toHaveLength(4);
    expect(new Set(choices.map(p => p.id)).size).toBe(4);
    expect(choices.every(p => p.text === 'സുപ്രഭാതം അമ്മേ' && p.src)).toBe(true);
  });
  it('preserves explicit Unicode text and recognizes RTL', () => {
    expect(promptText('"ബ്രിട്ടാസേ, നന്നാകാൻ ഉദ്ദേശമില്ലേ?"')).toBe('ബ്രിട്ടാസേ, നന്നാകാൻ ഉദ്ദേശമില്ലേ?');
    expect(isRTL('صباح الخير')).toBe(true);
    expect(isRTL('സുപ്രഭാതം')).toBe(false);
  });
  it('uses friendship artwork and keeps scripture separate', () => {
    expect(mockGenerate('Friends group DP, funny, Malayalam').every(p => p.category === 'dp/friends')).toBe(true);
    expect(mockGenerate('Christian good morning image with Psalm 118:24')[0]?.subtitle).toBe('Psalm 118:24');
  });
  it('provides unique category destinations and a multilingual flagship gallery', () => {
    expect(new Set(categories.map(c => c.slug)).size).toBe(categories.length);
    expect(morningPictures.some(p => /[\u0d00-\u0d7f]/.test(p.text))).toBe(true);
    expect(morningPictures.some(p => /[\u0900-\u097f]/.test(p.text))).toBe(true);
  });
});