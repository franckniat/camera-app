"use client";
import { useEffect, type ReactNode } from "react";
import { CameraOff, LoaderCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import type { Camera } from "@/hooks/use-camera";
import { cn } from "@/lib/utils";

/**
 * Live preview with loading and error states; fills its parent.
 * The whole frame stays visible (no cropping) so the preview matches what gets saved.
 * `children` are overlays shown once the camera is ready.
 */
export function CameraView({
	camera,
	mirrored,
	className,
	children,
}: {
	camera: Camera;
	mirrored: boolean;
	className?: string;
	children?: ReactNode;
}) {
	const { dict } = useI18n();
	const { status, error, videoRef, stream, retry } = camera;
	const message = error ? dict.camera.errors[error] : undefined;

	// Switching layouts (e.g. resizing a window) mounts a new <video>, which needs the stream again.
	useEffect(() => {
		const video = videoRef.current;
		if (video && stream && video.srcObject !== stream) video.srcObject = stream;
	}, [videoRef, stream]);

	return (
		<div className={cn("relative size-full overflow-hidden bg-black", className)}>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className={cn("block size-full object-contain", mirrored && "-scale-x-100", status !== "ready" && "invisible")}
			/>
			{status === "loading" && (
				<div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-white/70" role="status">
					<LoaderCircle className="size-5 animate-spin" />
					{dict.camera.loading}
				</div>
			)}
			{status === "error" && message && (
				<div
					className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-y-auto p-6 text-center text-white"
					role="alert"
				>
					<CameraOff className="size-10 text-white/60" />
					<h2 className="text-lg font-semibold">{message.title}</h2>
					<p className="max-w-sm text-sm text-white/70">{message.description}</p>
					{error !== "insecure" && (
						<Button variant="secondary" onClick={retry} className="mt-2">
							<RotateCcw />
							{dict.camera.retry}
						</Button>
					)}
				</div>
			)}
			{status === "ready" && children}
		</div>
	);
}
