"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export default function NotFound() {
	const { lang, dict } = useI18n();
	return (
		<main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
			<p className="text-6xl font-extrabold text-primary">404</p>
			<h1 className="text-2xl font-bold">{dict.notFound.title}</h1>
			<Button asChild>
				<Link href={`/${lang}`}>{dict.notFound.back}</Link>
			</Button>
		</main>
	);
}
