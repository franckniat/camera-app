"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { localeCookie, locales } from "@/lib/i18n/config";

export default function LanguageSwitch() {
	const { lang, dict } = useI18n();
	const pathname = usePathname();
	const target = locales.find((locale) => locale !== lang) ?? lang;
	const href = pathname.replace(new RegExp(`^/${lang}(?=/|$)`), `/${target}`);

	return (
		<Button asChild variant="outline" size="icon" className="rounded-full text-xs font-semibold">
			<Link
				href={href}
				hrefLang={target}
				aria-label={dict.settings.language}
				title={dict.settings.language}
				onClick={() => {
					// Remembered by proxy.ts for visits to unprefixed URLs.
					document.cookie = `${localeCookie}=${target}; path=/; max-age=31536000; samesite=lax`;
				}}
			>
				{dict.settings.languageShort}
			</Link>
		</Button>
	);
}
