"use client";
import type { ShellProps } from "@/components/camera/camera-controls";
import { DesktopShell } from "@/components/camera/desktop-shell";
import { ImmersiveShell } from "@/components/camera/immersive-shell";
import { useDevice } from "@/lib/device";

/** Picks the camera interface for this screen: phone, tablet or desktop. */
export function CameraShell(props: ShellProps) {
	const device = useDevice();
	return device === "desktop" ? <DesktopShell {...props} /> : <ImmersiveShell device={device} {...props} />;
}
