"use client";
import { useLocalStorage } from "usehooks-ts";

export const TIMER_OPTIONS = [0, 3, 10] as const;

export type CameraSettings = {
	deviceId?: string;
	mirrored: boolean;
	timer: (typeof TIMER_OPTIONS)[number];
	audio: boolean;
};

const DEFAULTS: CameraSettings = { mirrored: true, timer: 0, audio: true };

/** Camera preferences, remembered across visits. Client-only (reads localStorage on first render). */
export function useCameraSettings() {
	const [stored, setStored] = useLocalStorage<Partial<CameraSettings>>("camera-settings", DEFAULTS);
	const settings: CameraSettings = { ...DEFAULTS, ...stored };
	const update = (patch: Partial<CameraSettings>) =>
		setStored((previous) => ({ ...DEFAULTS, ...previous, ...patch }));
	return [settings, update] as const;
}
