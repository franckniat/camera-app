"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { Thumbnail } from "@/components/gallery/thumbnail";
import type { MediaLibrary } from "@/hooks/use-media-library";
import { plural } from "@/lib/i18n/format";
import type { MediaKind } from "@/lib/types";
import { cn } from "@/lib/utils";

// The panel (sheet, viewer, dialogs, zip) is only downloaded when first needed.
const loadSheet = () => import("@/components/gallery/gallery-sheet");
const GallerySheet = dynamic(loadSheet);

/** Gallery button showing the latest capture; opens the gallery panel. */
export default function MediaGallery({
	kind,
	library,
	disabled = false,
	sheetSide = "right",
	className,
}: {
	kind: MediaKind;
	library: MediaLibrary;
	disabled?: boolean;
	/** Phones open the gallery from the bottom, like a native photo picker. */
	sheetSide?: "right" | "bottom";
	className?: string;
}) {
	const { lang, dict } = useI18n();
	const [open, setOpen] = useState(false);
	const [openedAt, setOpenedAt] = useState<number | null>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { items } = library;
	const latest = items[0];
	const count = plural(lang, kind === "photo" ? dict.gallery.photoCount : dict.gallery.videoCount, items.length);

	return (
		<>
			<Button
				ref={buttonRef}
				variant="ghost"
				// Always drawn on the dark camera surface, so colors don't follow the site theme.
				className={cn(
					"relative size-16 overflow-hidden rounded-xl border-2 border-white/80 bg-white/10 p-0 text-white hover:bg-white/20 hover:text-white focus-visible:ring-white/50 dark:hover:bg-white/20",
					className
				)}
				aria-label={`${kind === "photo" ? dict.gallery.openPhotos : dict.gallery.openVideos} (${count})`}
				aria-haspopup="dialog"
				aria-expanded={open}
				title={count}
				disabled={disabled || library.loading}
				onPointerEnter={loadSheet}
				onFocus={loadSheet}
				onClick={() => {
					setOpenedAt(Date.now());
					setOpen(true);
				}}
			>
				{latest ? <Thumbnail item={latest} className="size-full" /> : <ImageIcon className="size-6" />}
				{items.length > 0 && (
					<span className="absolute top-1 right-1 min-w-5 rounded-full bg-primary px-1.5 text-[11px] leading-5 font-semibold text-primary-foreground">
						{items.length}
					</span>
				)}
			</Button>
			{openedAt !== null && (
				<GallerySheet
					kind={kind}
					library={library}
					open={open}
					onOpenChange={setOpen}
					now={openedAt}
					triggerRef={buttonRef}
					side={sheetSide}
				/>
			)}
		</>
	);
}
