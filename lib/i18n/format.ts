import type { Locale } from "./config";

export type Plural = { one: string; other: string };

/** Replaces `{name}` placeholders with the given values. */
export function format(
	template: string,
	values: Record<string, string | number>
): string {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match
	);
}

export function plural(lang: Locale, forms: Plural, count: number): string {
	const rule = new Intl.PluralRules(lang).select(count);
	return format(rule === "one" ? forms.one : forms.other, { count });
}
