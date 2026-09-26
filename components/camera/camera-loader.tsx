"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function CameraPlaceholder() {
	return (
		<div className="flex flex-col items-center gap-4" aria-hidden>
			<Skeleton className="aspect-video max-h-[calc(100dvh-15rem)] min-h-48 w-full max-w-4xl rounded-xl" />
			<Skeleton className="h-11 w-32 rounded-full" />
			<Skeleton className="size-16 rounded-full" />
		</div>
	);
}

// Camera code needs browser APIs only, so it is split out and never server-rendered.
const PhotoCamera = dynamic(() => import("./photo-camera"), { ssr: false, loading: CameraPlaceholder });
const VideoCamera = dynamic(() => import("./video-camera"), { ssr: false, loading: CameraPlaceholder });

export function CameraLoader({ mode }: { mode: "photo" | "video" }) {
	return mode === "photo" ? <PhotoCamera /> : <VideoCamera />;
}
