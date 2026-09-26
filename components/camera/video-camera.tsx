"use client";
import { useEffect, useState } from "react";
import { Circle, Square } from "lucide-react";
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
import { formatDuration } from "@/lib/format";
import { captureVideoPoster, pickRecordingType } from "@/lib/media";
import { cn } from "@/lib/utils";

type Recording = { recorder: MediaRecorder; startedAt: number };

export default function VideoCamera() {
	const { dict } = useI18n();
	const [settings, updateSettings] = useCameraSettings();
	const camera = useCamera({ deviceId: settings.deviceId, audio: settings.audio });
	const library = useMediaLibrary("video");
	const [recording, setRecording] = useState<Recording | null>(null);
	const [elapsed, setElapsed] = useState(0);

	useEffect(() => {
		if (!recording) return;
		const timer = setInterval(() => setElapsed((Date.now() - recording.startedAt) / 1000), 250);
		return () => clearInterval(timer);
	}, [recording]);

	// Leaving the page mid-recording still saves what was captured.
	useEffect(() => {
		if (!recording) return;
		const { recorder } = recording;
		return () => {
			if (recorder.state !== "inactive") recorder.stop();
		};
	}, [recording]);

	function startRecording() {
		const { stream } = camera;
		const video = camera.videoRef.current;
		if (!stream || !video || recording) return;

		let recorder: MediaRecorder;
		try {
			recorder = new MediaRecorder(stream, {
				mimeType: pickRecordingType(),
				videoBitsPerSecond: 2_500_000,
			});
		} catch {
			toast.error(dict.camera.recordingUnsupported);
			return;
		}

		const chunks: Blob[] = [];
		const startedAt = Date.now();
		const poster = captureVideoPoster(video).catch(() => null);

		recorder.addEventListener("dataavailable", (event) => {
			if (event.data.size > 0) chunks.push(event.data);
		});
		recorder.addEventListener("error", () => toast.error(dict.camera.recordingFailed));
		// Chunks are only complete once "stop" fires, so the video is assembled here.
		recorder.addEventListener("stop", async () => {
			setRecording(null);
			const mimeType = recorder.mimeType || chunks[0]?.type || "video/webm";
			const blob = new Blob(chunks, { type: mimeType });
			if (!blob.size) {
				toast.error(dict.camera.recordingFailed);
				return;
			}
			const frame = await poster;
			const saved = await library.add({
				id: crypto.randomUUID(),
				kind: "video",
				blob,
				thumb: frame?.thumb ?? null,
				mimeType,
				createdAt: startedAt,
				duration: (Date.now() - startedAt) / 1000,
				width: frame?.width,
				height: frame?.height,
			});
			if (saved) toast.success(dict.camera.videoSaved);
		});

		// A timeslice keeps memory usage flat on long recordings.
		recorder.start(1000);
		setElapsed(0);
		setRecording({ recorder, startedAt });
	}

	function stopRecording() {
		if (recording?.recorder.state !== "inactive") recording?.recorder.stop();
	}

	function toggleRecording() {
		if (recording) stopRecording();
		else if (camera.status === "ready") startRecording();
	}

	useSpaceShortcut(toggleRecording);

	const label = recording ? dict.camera.stopRecording : dict.camera.startRecording;

	return (
		<div className="flex flex-col items-center gap-4">
			<CameraView camera={camera} mirrored={settings.mirrored}>
				{recording && (
					<div
						role="timer"
						aria-label={dict.camera.recording}
						className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 font-mono text-sm text-white tabular-nums"
					>
						<span className="size-2.5 animate-pulse rounded-full bg-red-500" />
						{formatDuration(elapsed)}
					</div>
				)}
			</CameraView>

			<CameraToolbar
				camera={camera}
				settings={settings}
				onChange={updateSettings}
				mode="video"
				locked={Boolean(recording)}
			/>

			<div className="grid w-full max-w-sm grid-cols-3 items-center">
				<span />
				<Button
					size="camera"
					variant={recording ? "outline" : "default"}
					onClick={toggleRecording}
					disabled={camera.status !== "ready" && !recording}
					aria-label={label}
					aria-pressed={Boolean(recording)}
					title={`${label} (${dict.camera.shortcut})`}
					className={cn("justify-self-center ring-4", recording ? "ring-red-500/30" : "ring-primary/20")}
				>
					{recording ? (
						<Square className="fill-red-500 text-red-500" />
					) : (
						<Circle className="fill-current" />
					)}
				</Button>
				<div className="justify-self-end">
					<MediaGallery kind="video" library={library} disabled={Boolean(recording)} />
				</div>
			</div>
		</div>
	);
}
