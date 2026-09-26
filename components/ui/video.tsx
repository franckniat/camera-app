import type { ComponentProps, SyntheticEvent } from "react";

/**
 * Chrome writes WebM recordings without a duration, which breaks the seek bar.
 * Seeking far past the end forces the browser to compute it.
 */
function fixMissingDuration(event: SyntheticEvent<HTMLVideoElement>) {
	const video = event.currentTarget;
	if (video.duration !== Infinity) return;
	video.addEventListener("durationchange", () => (video.currentTime = 0), { once: true });
	video.currentTime = Number.MAX_SAFE_INTEGER;
}

export function Video(props: ComponentProps<"video">) {
	return <video controls playsInline preload="metadata" onLoadedMetadata={fixMissingDuration} {...props} />;
}
