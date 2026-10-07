// Analytics events (AI_AGENTS.md § Operator notes). Every event carries
// `category` + `language`. Sends to GA4 when PUBLIC_GA_ID is set (gtag loaded
// in Layout.astro); always logs to the console in dev.
export type TrackEvent = 'generate' | 'chip_tap' | 'image_open' | 'add_name' | 'download' | 'share' | 'filter' | 'make_own_cta';
export type TrackProps = { category: string; language: string } & Record<string, string | number | undefined>;

declare global { interface Window { gtag?: (...args: unknown[]) => void } }

/** Script of free text → language code ('en' when no Indic/Arabic script is present). */
export function detectLanguage(text: string): string {
 if (/[ഀ-ൿ]/.test(text)) return 'ml';
 if (/[ऀ-ॿ]/.test(text)) return 'hi';
 if (/[؀-ۿ]/.test(text)) return 'ar';
 return 'en';
}

export function track(event: TrackEvent, props: TrackProps): void {
 if (typeof window === 'undefined') return;
 if (import.meta.env.DEV) console.info('[track]', event, props);
 window.gtag?.('event', event, { ...props, transport_type: 'beacon' });
}
