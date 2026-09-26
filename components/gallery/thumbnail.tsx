import { Film, ImageIcon } from "lucide-react";
import { objectUrl } from "@/lib/media";
import type { MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Thumbnail({ item, className }: { item: MediaItem; className?: string }) {
	if (!item.thumb) {
		const Icon = item.kind === "video" ? Film : ImageIcon;
		return (
			<span className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
				<Icon />
			</span>
		);
	}
	return (
		<img src={objectUrl(item.thumb)} alt="" loading="lazy" decoding="async" className={cn("object-cover", className)} />
	);
}
