export type MediaKind = "photo" | "video";

export type MediaItem = {
	id: string;
	kind: MediaKind;
	/** Full-resolution photo or recorded video. */
	blob: Blob;
	/** Small JPEG preview shown in the gallery grid (null if it couldn't be generated). */
	thumb: Blob | null;
	mimeType: string;
	createdAt: number;
	width?: number;
	height?: number;
	/** Video length in seconds. */
	duration?: number;
};
