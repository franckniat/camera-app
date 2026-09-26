"use client";
import type { KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Download, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Video } from "@/components/ui/video";
import { useI18n } from "@/components/i18n-provider";
import { downloadItem } from "@/lib/download";
import { formatDateTime, formatDuration } from "@/lib/format";
import { format } from "@/lib/i18n/format";
import { objectUrl } from "@/lib/media";
import type { MediaItem } from "@/lib/types";

/** Full-size viewer. The full-resolution file is only read from storage when opened. */
export function Lightbox({
	items,
	index,
	onIndexChange,
	onRemove,
}: {
	items: MediaItem[];
	index: number | null;
	onIndexChange: (index: number | null) => void;
	onRemove: (item: MediaItem) => Promise<void>;
}) {
	const { lang, dict } = useI18n();
	const item = index === null ? undefined : items[index];
	const hasPrevious = index !== null && index > 0;
	const hasNext = index !== null && index < items.length - 1;

	function go(offset: number) {
		if (index === null) return;
		const next = index + offset;
		if (next >= 0 && next < items.length) onIndexChange(next);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.target instanceof HTMLVideoElement) return;
		if (event.key === "ArrowLeft") go(-1);
		if (event.key === "ArrowRight") go(1);
	}

	async function handleRemove() {
		if (!item || index === null) return;
		const remaining = items.length - 1;
		await onRemove(item);
		onIndexChange(remaining === 0 ? null : Math.min(index, remaining - 1));
	}

	return (
		<Dialog open={Boolean(item)} onOpenChange={(open) => !open && onIndexChange(null)}>
			<DialogContent
				showCloseButton={false}
				onKeyDown={handleKeyDown}
				className="gap-0 overflow-hidden p-0 sm:max-w-5xl"
			>
				{item && (
					<>
						<DialogTitle className="sr-only">{formatDateTime(item.createdAt, lang)}</DialogTitle>
						<DialogDescription className="sr-only">
							{format(dict.gallery.position, { index: (index ?? 0) + 1, total: items.length })}
						</DialogDescription>
						<div className="relative flex items-center justify-center bg-black">
							{item.kind === "photo" ? (
								<img
									key={item.id}
									src={objectUrl(item.blob)}
									alt={formatDateTime(item.createdAt, lang)}
									width={item.width}
									height={item.height}
									className="max-h-[75dvh] w-auto object-contain"
								/>
							) : (
								<Video
									key={item.id}
									src={objectUrl(item.blob)}
									poster={item.thumb ? objectUrl(item.thumb) : undefined}
									autoPlay
									className="max-h-[75dvh] w-full"
								/>
							)}
							{hasPrevious && (
								<Button
									size="icon"
									variant="secondary"
									aria-label={dict.gallery.previous}
									onClick={() => go(-1)}
									className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
								>
									<ChevronLeft />
								</Button>
							)}
							{hasNext && (
								<Button
									size="icon"
									variant="secondary"
									aria-label={dict.gallery.next}
									onClick={() => go(1)}
									className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
								>
									<ChevronRight />
								</Button>
							)}
						</div>
						<div className="flex flex-wrap items-center justify-between gap-2 p-3">
							<p className="text-sm text-muted-foreground">
								{formatDateTime(item.createdAt, lang)}
								{item.duration !== undefined && ` · ${formatDuration(item.duration)}`}
								<span className="ml-2 tabular-nums">
									{format(dict.gallery.position, { index: (index ?? 0) + 1, total: items.length })}
								</span>
							</p>
							<div className="flex gap-2">
								<Button variant="outline" size="sm" onClick={() => downloadItem(item)}>
									<Download />
									{dict.gallery.download}
								</Button>
								<Button variant="destructive" size="sm" onClick={handleRemove}>
									<Trash2 />
									{dict.gallery.delete}
								</Button>
								<DialogClose asChild>
									<Button variant="ghost" size="icon-sm" aria-label={dict.gallery.close}>
										<X />
									</Button>
								</DialogClose>
							</div>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
