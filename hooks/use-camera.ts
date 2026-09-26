"use client";
import { useEffect, useRef, useState } from "react";

export type CameraError = "notAllowed" | "notFound" | "notReadable" | "insecure" | "generic";
export type CameraStatus = "loading" | "ready" | "error";

type CameraOptions = {
	/** Preferred camera; falls back to the front camera when unavailable. */
	deviceId?: string;
	audio: boolean;
};

type Result = { key: string; stream?: MediaStream; error?: CameraError };

const QUALITY: MediaTrackConstraints = {
	width: { ideal: 1920 },
	height: { ideal: 1080 },
	frameRate: { ideal: 30 },
};

const AUDIO: MediaTrackConstraints = { echoCancellation: true, noiseSuppression: true };

function toCameraError(error: unknown): CameraError {
	switch ((error as { name?: string } | null)?.name) {
		case "NotAllowedError":
		case "SecurityError":
			return "notAllowed";
		case "NotFoundError":
		case "OverconstrainedError":
			return "notFound";
		case "NotReadableError":
		case "AbortError":
			return "notReadable";
		case "InsecureContextError":
			return "insecure";
		default:
			return "generic";
	}
}

async function openStream({ deviceId, audio }: CameraOptions): Promise<MediaStream> {
	if (!navigator.mediaDevices?.getUserMedia) {
		throw new DOMException(
			"getUserMedia unavailable",
			window.isSecureContext ? "NotSupportedError" : "InsecureContextError"
		);
	}
	// From most to least specific. A missing microphone must not block the camera.
	const attempts: MediaStreamConstraints[] = [];
	for (const withAudio of audio ? [true, false] : [false]) {
		const audioConstraints = withAudio ? AUDIO : false;
		if (deviceId) attempts.push({ video: { ...QUALITY, deviceId: { exact: deviceId } }, audio: audioConstraints });
		attempts.push({ video: { ...QUALITY, facingMode: "user" }, audio: audioConstraints });
		attempts.push({ video: true, audio: audioConstraints });
	}

	let lastError: unknown;
	for (const constraints of attempts) {
		try {
			return await navigator.mediaDevices.getUserMedia(constraints);
		} catch (error) {
			lastError = error;
			const name = (error as { name?: string }).name;
			// Denied permission or an insecure page won't change with looser constraints.
			if (name === "SecurityError" || (name === "NotAllowedError" && !constraints.audio)) break;
		}
	}
	throw lastError;
}

async function listCameras() {
	const devices = await navigator.mediaDevices.enumerateDevices();
	// Device ids are empty until the user grants permission.
	return devices.filter((device) => device.kind === "videoinput" && device.deviceId);
}

function stopStream(stream: MediaStream) {
	for (const track of stream.getTracks()) track.stop();
}

export function useCamera({ deviceId, audio }: CameraOptions) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [attempt, setAttempt] = useState(0);
	const [result, setResult] = useState<Result>();
	const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

	// Each request is identified by its options, so a stale result reads as "loading".
	const key = `${deviceId ?? ""}|${audio}|${attempt}`;

	useEffect(() => {
		let active = true;
		let stream: MediaStream | undefined;

		openStream({ deviceId, audio })
			.then((opened) => {
				stream = opened;
				if (!active) return stopStream(opened);
				opened.getVideoTracks()[0]?.addEventListener("ended", () => {
					if (active) setResult({ key, error: "notReadable" });
				});
				setResult({ key, stream: opened });
				return listCameras().then((list) => {
					if (active) setCameras(list);
				});
			})
			.catch((error) => {
				if (active) setResult({ key, error: toCameraError(error) });
			});

		return () => {
			active = false;
			if (stream) stopStream(stream);
		};
	}, [key, deviceId, audio]);

	useEffect(() => {
		const mediaDevices = navigator.mediaDevices;
		if (!mediaDevices) return;
		const refresh = () => {
			listCameras().then(setCameras, () => {});
		};
		mediaDevices.addEventListener("devicechange", refresh);
		return () => mediaDevices.removeEventListener("devicechange", refresh);
	}, []);

	const current = result?.key === key ? result : undefined;
	const stream = current?.stream;
	const status: CameraStatus = !current ? "loading" : current.error ? "error" : "ready";

	useEffect(() => {
		const video = videoRef.current;
		if (video && stream && video.srcObject !== stream) video.srcObject = stream;
	}, [stream]);

	const activeDeviceId = stream?.getVideoTracks()[0]?.getSettings().deviceId;

	/** Id of the next camera in the list, for the "switch camera" button. */
	function nextCameraId() {
		if (cameras.length < 2) return undefined;
		const index = cameras.findIndex((camera) => camera.deviceId === activeDeviceId);
		return cameras[(index + 1) % cameras.length].deviceId;
	}

	return {
		videoRef,
		stream,
		status,
		error: current?.error,
		hasAudio: Boolean(stream?.getAudioTracks().length),
		canSwitch: cameras.length > 1,
		nextCameraId,
		retry: () => setAttempt((n) => n + 1),
	};
}

export type Camera = ReturnType<typeof useCamera>;
