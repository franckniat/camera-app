"use client";
import { useState, type RefObject } from "react";
import { Download, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/components/i18n-provider";
import { Lightbox } from "@/components/gallery/lightbox";
import { Thumbnail } from "@/components/gallery/thumbnail";
import type { MediaLibrary } from "@/hooks/use-media-library";
import { downloadItem, downloadZip } from "@/lib/download";
import { formatDuration, formatRelativeTime } from "@/lib/format";
import { format, plural } from "@/lib/i18n/format";
import type { MediaItem, MediaKind } from "@/lib/types";

/** Gallery panel, loaded on first open (see media-gallery.tsx). */
export default function GallerySheet({
	kind,
	library,
	open,
	onOpenChange,
	now,
	triggerRef,
}: {
	kind: MediaKind;
	library: MediaLibrary;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Reference time for relative dates, captured when the panel was opened. */
	now: number;
	/** Receives focus back when the panel closes. */
	triggerRef: RefObject<HTMLButtonElement | null>;
}) {
	const { lang, dict } = useI18n();
	const { items, remove, clear } = library;
	const [viewing, setViewing] = useState<number | null>(null);

	const isPhoto = kind === "photo";
	const count = plural(lang, isPhoto ? dict.gallery.photoCount : dict.gallery.videoCount, items.length);

	async function handleRemove(item: MediaItem) {
		await remove(item);
		toast.success(dict.gallery.deleted);
	}

	async function handleClear() {
		await clear();
		toast.success(dict.gallery.allDeleted);
	}

	function handleDownloadAll() {
		toast.promise(downloadZip(items, `${isPhoto ? "photos" : "videos"}-${Date.now()}.zip`), {
			loading: dict.gallery.preparingZip,
			error: dict.gallery.zipFailed,
		});
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				className="w-full gap-0 sm:max-w-lg"
				closeLabel={dict.gallery.close}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					triggerRef.current?.focus();
				}}
			>
				<SheetHeader className="border-b">
					<SheetTitle>{isPhoto ? dict.gallery.photosTitle : dict.gallery.videosTitle}</SheetTitle>
					<SheetDescription>{count}</SheetDescription>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto p-4">
					{items.length === 0 ? (
						<p className="py-12 text-center text-sm text-muted-foreground">{dict.gallery.empty}</p>
					) : (
						<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{items.map((item, index) => (
								<li key={item.id} className="group relative overflow-hidden rounded-lg border bg-muted">
									<button
										type="button"
										onClick={() => setViewing(index)}
										aria-label={`${dict.gallery.open} – ${formatRelativeTime(item.createdAt, lang, now)}`}
										className="block aspect-square w-full focus-visible:outline-2 focus-visible:outline-ring"
									>
										<Thumbnail item={item} className="size-full transition-transform duration-300 group-hover:scale-105" />
										<span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-linear-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 text-left text-[11px] text-white">
											<span className="truncate">{formatRelativeTime(item.createdAt, lang, now)}</span>
											{item.duration !== undefined && (
												<span className="flex shrink-0 items-center gap-0.5 font-medium tabular-nums">
													<Play className="size-3 fill-current" />
													{formatDuration(item.duration)}
												</span>
											)}
										</span>
									</button>
									<div className="absolute top-1.5 right-1.5 flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
										<Button
											size="icon-sm"
											variant="secondary"
											className="shadow-sm"
											aria-label={dict.gallery.download}
											title={dict.gallery.download}
											onClick={() => downloadItem(item)}
										>
											<Download />
										</Button>
										<Button
											size="icon-sm"
											variant="destructive"
											className="shadow-sm"
											aria-label={dict.gallery.delete}
											title={dict.gallery.delete}
											onClick={() => handleRemove(item)}
										>
											<Trash2 />
										</Button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				{items.length > 0 && (
					<SheetFooter className="flex-row justify-between border-t">
						<Button variant="outline" onClick={handleDownloadAll}>
							<Download />
							{dict.gallery.downloadAll}
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive">
									<Trash2 />
									{dict.gallery.deleteAll}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>{dict.gallery.confirmTitle}</AlertDialogTitle>
									<AlertDialogDescription>
										{format(isPhoto ? dict.gallery.confirmPhotos : dict.gallery.confirmVideos, {
											count: items.length,
										})}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>{dict.gallery.cancel}</AlertDialogCancel>
									<AlertDialogAction variant="destructive" onClick={handleClear}>
										{dict.gallery.confirm}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</SheetFooter>
				)}

				<Lightbox
					items={items}
					index={viewing}
					onIndexChange={setViewing}
					onRemove={handleRemove}
				/>
			</SheetContent>
		</Sheet>
	);
}
