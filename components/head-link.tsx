"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Video } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

export default function HeadLink() {
	const { lang, dict } = useI18n();
	const pathname = usePathname();
	const links = [
		{ href: `/${lang}/photos`, label: dict.nav.photo, Icon: Camera },
		{ href: `/${lang}/videos`, label: dict.nav.video, Icon: Video },
	];

	return (
		<nav aria-label={dict.nav.modes} className="flex h-10 w-fit items-center rounded-full bg-muted p-1 text-sm">
			{links.map(({ href, label, Icon }) => {
				const active = pathname === href;
				return (
					<Link
						key={href}
						href={href}
						aria-current={active ? "page" : undefined}
						className={cn(
							"flex h-8 items-center gap-1.5 rounded-full px-4 font-medium text-muted-foreground transition-colors hover:text-foreground",
							active && "bg-background text-foreground shadow-sm"
						)}
					>
						<Icon className="size-4" />
						{label}
					</Link>
				);
			})}
		</nav>
	);
}
