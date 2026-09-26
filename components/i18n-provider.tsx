"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const I18nContext = createContext<{ lang: Locale; dict: Dictionary } | null>(null);

/** `dict` comes from the server layout, so only the active language reaches the browser. */
export function I18nProvider({
	lang,
	dict,
	children,
}: {
	lang: Locale;
	dict: Dictionary;
	children: ReactNode;
}) {
	return (
		<I18nContext.Provider value={{ lang, dict }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n() {
	const context = useContext(I18nContext);
	if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
	return context;
}
