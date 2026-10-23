import type { Viewport } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeadLink from "@/components/head-link";
import { SiteControls } from "@/components/site-controls";
import { Toaster } from "@/components/ui/sonner";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const viewport: Viewport = {
	// Lets the full-screen camera draw under notches and home indicators (it pads with safe-area insets).
	viewportFit: "cover",
	themeColor: [{ media: "(max-width: 767px), (pointer: coarse)", color: "#000000" }],
};

export default async function CaptureLayout({ children, params }: LayoutProps<"/[lang]">) {
	const lang = (await params).lang as Locale;
	const { nav } = getDictionary(lang);

	// Phones and tablets get a full-screen camera with its own controls, so the header is desktop-only.
	return (
		<div className="mx-auto flex h-dvh min-h-[34rem] max-w-6xl flex-col px-4 pb-4 immersive:min-h-0 immersive:overflow-hidden">
			<header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 immersive:hidden">
				<Link
					href={`/${lang}`}
					className="flex items-center gap-2 justify-self-start rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
				>
					<ArrowLeft className="size-4" />
					{nav.back}
				</Link>
				<HeadLink />
				<SiteControls className="justify-self-end" />
			</header>
			<main className="flex min-h-0 flex-1 flex-col">{children}</main>
			<Toaster position="top-center" richColors closeButton />
		</div>
	);
}
