import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeadLink from "@/components/head-link";
import { SiteControls } from "@/components/site-controls";
import { Toaster } from "@/components/ui/sonner";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function CaptureLayout({ children, params }: LayoutProps<"/[lang]">) {
	const lang = (await params).lang as Locale;
	const { nav } = getDictionary(lang);

	return (
		<div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-3 pb-6">
			<header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3">
				<Link
					href={`/${lang}`}
					className="flex items-center gap-2 justify-self-start rounded-md px-2 py-2 text-sm font-medium hover:bg-accent sm:px-3"
				>
					<ArrowLeft className="size-4" />
					<span className="max-sm:sr-only">{nav.back}</span>
				</Link>
				<HeadLink />
				<SiteControls className="justify-self-end" />
			</header>
			<main className="flex-1">{children}</main>
			<Toaster richColors closeButton />
		</div>
	);
}
