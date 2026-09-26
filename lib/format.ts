import type { Locale } from "./i18n/config";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	["year", 365 * 24 * 3600],
	["month", 30 * 24 * 3600],
	["week", 7 * 24 * 3600],
	["day", 24 * 3600],
	["hour", 3600],
	["minute", 60],
	["second", 1],
];

/** "3 minutes ago" / "il y a 3 minutes". */
export function formatRelativeTime(date: number, lang: Locale, now = Date.now()) {
	const seconds = Math.round((date - now) / 1000);
	const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
	for (const [unit, size] of UNITS) {
		if (Math.abs(seconds) >= size || unit === "second") {
			return rtf.format(Math.round(seconds / size), unit);
		}
	}
	return rtf.format(0, "second");
}

export function formatDateTime(date: number, lang: Locale) {
	return new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

/** Seconds → "m:ss" (or "h:mm:ss"). */
export function formatDuration(totalSeconds: number) {
	const s = Math.max(0, Math.floor(totalSeconds));
	const hours = Math.floor(s / 3600);
	const minutes = Math.floor((s % 3600) / 60);
	const seconds = String(s % 60).padStart(2, "0");
	return hours
		? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
		: `${minutes}:${seconds}`;
}
