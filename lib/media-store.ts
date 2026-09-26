import { createStore, del, delMany, set, setMany, values, type UseStore } from "idb-keyval";
import { imageThumbnail } from "./media";
import type { MediaItem, MediaKind } from "./types";

let store: UseStore | undefined;

function getStore(): UseStore {
	store ??= createStore("web-camera", "media");
	return store;
}

export class StorageFullError extends Error {
	constructor(cause: unknown) {
		super("Storage quota exceeded", { cause });
		this.name = "StorageFullError";
	}
}

function isQuotaError(error: unknown) {
	return error instanceof DOMException && error.name === "QuotaExceededError";
}

let persistRequested = false;

export async function addMedia(item: MediaItem) {
	if (!persistRequested) {
		persistRequested = true;
		// Ask the browser not to evict the gallery under storage pressure.
		navigator.storage?.persist?.().catch(() => {});
	}
	try {
		await set(item.id, item, getStore());
	} catch (error) {
		throw isQuotaError(error) ? new StorageFullError(error) : error;
	}
}

export async function listMedia(kind: MediaKind): Promise<MediaItem[]> {
	const items = await values<MediaItem>(getStore());
	return items
		.filter((item) => item.kind === kind)
		.sort((a, b) => b.createdAt - a.createdAt);
}

export function deleteMedia(id: string) {
	return del(id, getStore());
}

export function deleteManyMedia(ids: string[]) {
	return delMany(ids, getStore());
}

type LegacyPhoto = { src: string | null; date: string };

let migration: Promise<void> | undefined;

/**
 * Earlier versions kept base64 photos and `blob:` video URLs in localStorage.
 * Photos are moved to IndexedDB; video URLs died with their tab, so they're dropped.
 */
export function migrateLegacyStorage(): Promise<void> {
	migration ??= (async () => {
		let raw: string | null = null;
		try {
			raw = localStorage.getItem("photos");
			localStorage.removeItem("videos");
		} catch {
			return;
		}
		if (!raw) return;

		let legacy: LegacyPhoto[] = [];
		try {
			legacy = JSON.parse(raw);
		} catch {
			// Unreadable data, nothing to recover.
		}
		const items: [string, MediaItem][] = [];
		for (const photo of Array.isArray(legacy) ? legacy : []) {
			if (!photo?.src?.startsWith("data:image/")) continue;
			try {
				const blob = await (await fetch(photo.src)).blob();
				const { thumb, width, height } = await imageThumbnail(blob);
				const createdAt = Date.parse(photo.date) || Date.now();
				const id = crypto.randomUUID();
				items.push([id, { id, kind: "photo", blob, thumb, mimeType: blob.type, createdAt, width, height }]);
			} catch {
				// Skip photos that can't be decoded.
			}
		}
		if (items.length) await setMany(items, getStore());
		localStorage.removeItem("photos");
	})();
	return migration;
}
