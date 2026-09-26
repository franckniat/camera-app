const THUMB_SIZE = 480;

type Size = { width: number; height: number };

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error("Canvas encoding failed"))),
			type,
			quality
		);
	});
}

function draw(
	source: CanvasImageSource,
	sourceSize: Size,
	targetSize: Size,
	mirrored: boolean
): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.width = targetSize.width;
	canvas.height = targetSize.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas 2D context unavailable");
	if (mirrored) {
		ctx.translate(targetSize.width, 0);
		ctx.scale(-1, 1);
	}
	ctx.drawImage(source, 0, 0, sourceSize.width, sourceSize.height, 0, 0, targetSize.width, targetSize.height);
	return canvas;
}

function fit({ width, height }: Size, max: number): Size {
	const scale = Math.min(1, max / Math.max(width, height));
	return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

async function thumbnail(source: CanvasImageSource, size: Size, mirrored = false): Promise<Blob> {
	return toBlob(draw(source, size, fit(size, THUMB_SIZE), mirrored), "image/jpeg", 0.8);
}

function videoSize(video: HTMLVideoElement): Size {
	if (!video.videoWidth || !video.videoHeight) throw new Error("Video frame unavailable");
	return { width: video.videoWidth, height: video.videoHeight };
}

/** Grabs the current frame of a live preview as a full-size JPEG plus a thumbnail. */
export async function capturePhoto(video: HTMLVideoElement, mirrored: boolean) {
	const size = videoSize(video);
	const [blob, thumb] = await Promise.all([
		toBlob(draw(video, size, size, mirrored), "image/jpeg", 0.92),
		thumbnail(video, size, mirrored),
	]);
	return { blob, thumb, ...size };
}

/** Thumbnail of the current frame, used as a video poster. */
export async function captureVideoPoster(video: HTMLVideoElement) {
	const size = videoSize(video);
	return { thumb: await thumbnail(video, size), ...size };
}

/** Thumbnail from an existing image file (used when migrating old data). */
export async function imageThumbnail(blob: Blob) {
	const bitmap = await createImageBitmap(blob);
	try {
		const size = { width: bitmap.width, height: bitmap.height };
		return { thumb: await thumbnail(bitmap, size), ...size };
	} finally {
		bitmap.close();
	}
}

const RECORDING_TYPES = [
	"video/webm;codecs=vp9,opus",
	"video/webm;codecs=vp8,opus",
	"video/webm",
	"video/mp4;codecs=avc1,mp4a",
	"video/mp4",
];

/** First container/codec the browser can record, or undefined to let it choose. */
export function pickRecordingType(): string | undefined {
	return RECORDING_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

const objectUrls = new WeakMap<Blob, string>();

/** Returns a cached object URL for a blob, so re-renders don't create new ones. */
export function objectUrl(blob: Blob): string {
	let url = objectUrls.get(blob);
	if (!url) {
		url = URL.createObjectURL(blob);
		objectUrls.set(blob, url);
	}
	return url;
}

export function revokeObjectUrl(blob: Blob) {
	const url = objectUrls.get(blob);
	if (url) {
		URL.revokeObjectURL(url);
		objectUrls.delete(blob);
	}
}
