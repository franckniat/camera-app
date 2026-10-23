"use client";
import { useSyncExternalStore } from "react";

export type Device = "phone" | "tablet" | "desktop";

// Phones: narrow screens, or a touch screen too short to be a tablet (a phone held sideways).
const PHONE = "(max-width: 767px), (pointer: coarse) and (max-height: 540px)";
// Phones and tablets get the full-screen camera. Keep in sync with the `immersive` variant in globals.css.
const IMMERSIVE = "(max-width: 767px), (pointer: coarse)";

function getDevice(): Device {
	if (matchMedia(PHONE).matches) return "phone";
	if (matchMedia(IMMERSIVE).matches) return "tablet";
	return "desktop";
}

function subscribe(onChange: () => void) {
	const queries = [PHONE, IMMERSIVE].map((query) => matchMedia(query));
	for (const query of queries) query.addEventListener("change", onChange);
	return () => {
		for (const query of queries) query.removeEventListener("change", onChange);
	};
}

/** Which camera interface fits this screen. Updates on rotation and window resizes. */
export function useDevice(): Device {
	return useSyncExternalStore(subscribe, getDevice, () => "desktop");
}
