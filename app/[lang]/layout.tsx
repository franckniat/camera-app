import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "../globals.css";

const monaSans = Mona_Sans({
	variable: "--font-mona-sans",
	subsets: ["latin"],
});

// Only the listed locales exist; every page is prerendered for each of them.
export const dynamicParams = false;

export function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
	const { lang } = await params;
	if (!isLocale(lang)) return {};
	const { meta } = getDictionary(lang);
	return {
		title: { default: meta.title, template: `%s · ${meta.title}` },
		description: meta.description,
		alternates: {
			languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}`])),
		},
	};
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
	const { lang } = await params;
	if (!isLocale(lang)) notFound();

	return (
		<html lang={lang} suppressHydrationWarning>
			<body className={`${monaSans.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<I18nProvider lang={lang} dict={getDictionary(lang)}>
						{children}
					</I18nProvider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
