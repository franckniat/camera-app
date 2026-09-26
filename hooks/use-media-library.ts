"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { revokeObjectUrl } from "@/lib/media";
import {
	StorageFullError,
	addMedia,
	deleteManyMedia,
	deleteMedia,
	listMedia,
	migrateLegacyStorage,
} from "@/lib/media-store";
import type { MediaItem, MediaKind } from "@/lib/types";

function release(item: MediaItem) {
	revokeObjectUrl(item.blob);
	if (item.thumb) revokeObjectUrl(item.thumb);
}

/** Photos or videos saved on this device, newest first. */
export function useMediaLibrary(kind: MediaKind) {
	const { dict } = useI18n();
	const [items, setItems] = useState<MediaItem[] | null>(null);
	const loadFailed = dict.storage.loadFailed;

	useEffect(() => {
		let active = true;
		migrateLegacyStorage()
			.catch(() => {})
			.then(() => listMedia(kind))
			.then(
				(list) => {
					if (active) setItems(list);
				},
				() => {
					if (!active) return;
					setItems([]);
					toast.error(loadFailed);
				}
			);
		return () => {
			active = false;
		};
	}, [kind, loadFailed]);

	/** Saves an item; resolves to false (after telling the user) when it couldn't be stored. */
	async function add(item: MediaItem) {
		try {
			await addMedia(item);
			setItems((previous) => [item, ...(previous ?? [])]);
			return true;
		} catch (error) {
			toast.error(error instanceof StorageFullError ? dict.storage.quotaExceeded : dict.storage.saveFailed);
			return false;
		}
	}

	async function remove(item: MediaItem) {
		await deleteMedia(item.id);
		release(item);
		setItems((previous) => previous?.filter(({ id }) => id !== item.id) ?? previous);
	}

	async function clear() {
		const all = items ?? [];
		await deleteManyMedia(all.map(({ id }) => id));
		all.forEach(release);
		setItems([]);
	}

	return { items: items ?? [], loading: items === null, add, remove, clear };
}

export type MediaLibrary = ReturnType<typeof useMediaLibrary>;
