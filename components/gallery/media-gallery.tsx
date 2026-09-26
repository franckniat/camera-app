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

// The panel (sheet, viewer, dialogs, zip) is only downloaded when first needed.
const loadSheet = () => import("@/components/gallery/gallery-sheet");
const GallerySheet = dynamic(loadSheet);

/** Gallery button showing the latest capture; opens the gallery panel. */
export default function MediaGallery({
	kind,
	library,
	disabled = false,
}: {
	kind: MediaKind;
	library: MediaLibrary;
	disabled?: boolean;
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
				variant="outline"
				className="relative size-16 overflow-hidden rounded-xl p-0"
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
				/>
			)}
		</>
	);
}
