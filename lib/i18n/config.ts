export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeCookie = "lang";

export function isLocale(value: string | undefined | null): value is Locale {
	return locales.includes(value as Locale);
}

/** Picks the first supported locale from an Accept-Language header. */
export function matchLocale(acceptLanguage: string | null): Locale {
	if (!acceptLanguage) return defaultLocale;
	for (const part of acceptLanguage.split(",")) {
		const tag = part.split(";")[0].trim().toLowerCase().split("-")[0];
		if (isLocale(tag)) return tag;
	}
	return defaultLocale;
}
