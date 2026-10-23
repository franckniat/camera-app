"use client";
import { useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { CameraView } from "@/components/camera/camera-view";
import type { Camera } from "@/hooks/use-camera";
import type { MediaKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const SWIPE_DISTANCE = 60;

/** Preview area: the live feed, its overlays and an optional status badge. */
export function Viewfinder({
	camera,
	mirrored,
	overlay,
	status,
	statusClassName,
	swipe,
	className,
}: {
	camera: Camera;
	mirrored: boolean;
	overlay?: ReactNode;
	status?: ReactNode;
	statusClassName?: string;
	/** Touch screens: swiping sideways switches between photo and video, as in native camera apps. */
	swipe?: { mode: MediaKind; disabled: boolean };
	className?: string;
}) {
	const { lang } = useI18n();
	const router = useRouter();
	const start = useRef<{ x: number; y: number } | null>(null);

	const swipeHandlers = swipe && {
		onPointerDown: (event: React.PointerEvent) => {
			if (event.pointerType !== "mouse") start.current = { x: event.clientX, y: event.clientY };
		},
		onPointerUp: (event: React.PointerEvent) => {
			const from = start.current;
			start.current = null;
			if (!from || swipe.disabled) return;
			const dx = event.clientX - from.x;
			const dy = event.clientY - from.y;
			if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
			const target: MediaKind = dx < 0 ? "video" : "photo";
			if (target !== swipe.mode) router.replace(`/${lang}/${target}s`);
		},
		onPointerCancel: () => {
			start.current = null;
		},
	};

	return (
		// touch-none: the browser would otherwise claim sideways swipes for panning.
		<div className={cn("relative", swipe && "touch-none", className)} {...swipeHandlers}>
			<CameraView camera={camera} mirrored={mirrored}>
				{overlay}
			</CameraView>
			{status && (
				<div className={cn("pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3", statusClassName)}>
					{status}
				</div>
			)}
		</div>
	);
}
