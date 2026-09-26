"use client";
import { useEffect, useRef, useState } from "react";
import { CameraIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { CameraToolbar } from "@/components/camera/camera-toolbar";
import { CameraView } from "@/components/camera/camera-view";
import MediaGallery from "@/components/gallery/media-gallery";
import { useCamera } from "@/hooks/use-camera";
import { useCameraSettings } from "@/hooks/use-camera-settings";
import { useMediaLibrary } from "@/hooks/use-media-library";
import { useSpaceShortcut } from "@/hooks/use-space-shortcut";
import { capturePhoto } from "@/lib/media";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PhotoCamera() {
	const { dict } = useI18n();
	const [settings, updateSettings] = useCameraSettings();
	const camera = useCamera({ deviceId: settings.deviceId, audio: false });
	const library = useMediaLibrary("photo");
	const [countdown, setCountdown] = useState<number | null>(null);
	const [flashes, setFlashes] = useState(0);
	const mounted = useRef(true);

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	const ready = camera.status === "ready" && countdown === null;

	async function takePhoto() {
		const video = camera.videoRef.current;
		if (!video || !ready) return;

		for (let seconds = settings.timer; seconds > 0; seconds--) {
			setCountdown(seconds);
			await sleep(1000);
			if (!mounted.current) return;
		}
		setCountdown(null);

		try {
			const shot = await capturePhoto(video, settings.mirrored);
			setFlashes((n) => n + 1);
			await library.add({
				id: crypto.randomUUID(),
				kind: "photo",
				mimeType: shot.blob.type,
				createdAt: Date.now(),
				...shot,
			});
		} catch {
			toast.error(dict.camera.captureFailed);
		}
	}

	useSpaceShortcut(takePhoto);

	return (
		<div className="flex flex-col items-center gap-4">
			<CameraView camera={camera} mirrored={settings.mirrored}>
				{countdown !== null && (
					<div
						key={countdown}
						aria-live="assertive"
						className="absolute inset-0 flex animate-countdown-pop items-center justify-center text-8xl font-bold text-white drop-shadow-lg"
					>
						{countdown}
					</div>
				)}
				{flashes > 0 && (
					<div key={flashes} className="pointer-events-none absolute inset-0 animate-camera-flash bg-white" />
				)}
			</CameraView>

			<CameraToolbar camera={camera} settings={settings} onChange={updateSettings} mode="photo" />

			<div className="grid w-full max-w-sm grid-cols-3 items-center">
				<span />
				<Button
					size="camera"
					onClick={takePhoto}
					disabled={!ready}
					aria-label={dict.camera.takePhoto}
					title={`${dict.camera.takePhoto} (${dict.camera.shortcut})`}
					className="justify-self-center ring-4 ring-primary/20"
				>
					<CameraIcon />
				</Button>
				<div className="justify-self-end">
					<MediaGallery kind="photo" library={library} />
				</div>
			</div>
		</div>
	);
}
