import Link from "next/link";
import { Camera } from "lucide-react";
import { GithubIcon } from "@/components/github-icon";
import { Button } from "@/components/ui/button";
import { SiteControls } from "@/components/site-controls";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
	const lang = (await params).lang as Locale;
	const { home } = getDictionary(lang);

	return (
		<div className="flex min-h-dvh flex-col px-4">
			<header className="flex justify-end py-3">
				<SiteControls />
			</header>
			<main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
				<span className="text-5xl lg:text-6xl" aria-hidden>
					📸
				</span>
				<h1 className="text-3xl font-extrabold tracking-tight text-balance md:text-5xl lg:text-6xl">
					{home.titleBefore} <span className="text-primary underline">{home.titleHighlight}</span>
					{home.titleAfter && ` ${home.titleAfter}`}
				</h1>
				<p className="max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl">{home.description}</p>
				<div className="mt-4 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
					<Button asChild size="xl" className="w-full sm:w-fit">
						<Link href={`/${lang}/photos`}>
							<Camera />
							{home.getStarted}
						</Link>
					</Button>
					<Button asChild size="xl" variant="secondary" className="w-full sm:w-fit">
						<Link href="https://github.com/franckniat/camera-app" target="_blank" rel="noreferrer">
							<GithubIcon />
							{home.contribute}
						</Link>
					</Button>
				</div>
			</main>
			<footer className="py-5 text-center">
				<Link
					href="https://franckniat.me/about"
					className="text-sm font-medium text-foreground/80 hover:underline sm:text-base"
				>
					{home.credits}
				</Link>
			</footer>
		</div>
	);
}
