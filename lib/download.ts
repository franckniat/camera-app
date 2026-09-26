import type { MediaItem } from "./types";

const EXTENSIONS: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"video/webm": "webm",
	"video/mp4": "mp4",
	"video/quicktime": "mov",
};

function extension(mimeType: string) {
	return EXTENSIONS[mimeType.split(";")[0].trim()] ?? "bin";
}

function timestamp(date: number) {
	const d = new Date(date);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

export function fileName(item: MediaItem) {
	return `${item.kind}-${timestamp(item.createdAt)}.${extension(item.mimeType)}`;
}

export function downloadBlob(blob: Blob, name: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function downloadItem(item: MediaItem) {
	downloadBlob(item.blob, fileName(item));
}

export async function downloadZip(items: MediaItem[], name: string) {
	const { downloadZip: zip } = await import("client-zip");
	const blob = await zip(
		items.map((item) => ({
			name: fileName(item),
			input: item.blob,
			lastModified: new Date(item.createdAt),
		}))
	).blob();
	downloadBlob(blob, name);
}
