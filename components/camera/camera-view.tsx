"use client";
import type { ReactNode } from "react";
import { CameraOff, LoaderCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import type { Camera } from "@/hooks/use-camera";
import { cn } from "@/lib/utils";

// Leaves room for the header and controls so everything fits on one screen.
const MAX_HEIGHT = "max-h-[calc(100dvh-15rem)]";

/** Live preview with loading and error states. `children` are overlays shown once the camera is ready. */
export function CameraView({
	camera,
	mirrored,
	children,
}: {
	camera: Camera;
	mirrored: boolean;
	children?: ReactNode;
}) {
	const { dict } = useI18n();
	const { status, error, videoRef, retry } = camera;
	const message = error ? dict.camera.errors[error] : undefined;

	return (
		<div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl border bg-black shadow-sm">
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className={cn(
					"block w-full object-contain",
					MAX_HEIGHT,
					mirrored && "-scale-x-100",
					status !== "ready" && "invisible absolute inset-0 h-full"
				)}
			/>
			{status === "loading" && (
				<div
					className={cn("flex aspect-video min-h-48 w-full items-center justify-center gap-2 text-sm text-white/70", MAX_HEIGHT)}
					role="status"
				>
					<LoaderCircle className="size-5 animate-spin" />
					{dict.camera.loading}
				</div>
			)}
			{status === "error" && message && (
				<div
					className={cn("flex aspect-video min-h-72 w-full flex-col items-center justify-center gap-3 p-6 text-center text-white", MAX_HEIGHT)}
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
