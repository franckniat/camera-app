"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Before JS knows the device, CSS picks the matching placeholder (see the `immersive` variant).
function CameraPlaceholder() {
	return (
		<>
			<div className="fixed inset-0 hidden bg-black immersive:block" aria-hidden />
			<div className="flex min-h-0 flex-1 flex-col gap-3 immersive:hidden" aria-hidden>
				<Skeleton className="min-h-80 flex-1 rounded-2xl" />
				<Skeleton className="mx-auto h-4 w-56" />
			</div>
		</>
	);
}

// Camera code needs browser APIs only, so it is split out and never server-rendered.
const PhotoCamera = dynamic(() => import("./photo-camera"), { ssr: false, loading: CameraPlaceholder });
const VideoCamera = dynamic(() => import("./video-camera"), { ssr: false, loading: CameraPlaceholder });

export function CameraLoader({ mode }: { mode: "photo" | "video" }) {
	return mode === "photo" ? <PhotoCamera /> : <VideoCamera />;
}
