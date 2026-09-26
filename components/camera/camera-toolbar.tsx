"use client";
import type { ReactNode } from "react";
import { FlipHorizontal2, Mic, MicOff, SwitchCamera, Timer, TimerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import type { Camera } from "@/hooks/use-camera";
import { TIMER_OPTIONS, type CameraSettings } from "@/hooks/use-camera-settings";
import { format } from "@/lib/i18n/format";

function ToolbarButton({
	label,
	pressed,
	disabled,
	onClick,
	children,
}: {
	label: string;
	pressed?: boolean;
	disabled?: boolean;
	onClick: () => void;
	children: ReactNode;
}) {
	// Native tooltip: a positioning library just for these hints would outweigh the whole toolbar.
	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={label}
			title={label}
			aria-pressed={pressed}
			disabled={disabled}
			onClick={onClick}
			className="rounded-full aria-pressed:bg-accent aria-pressed:text-accent-foreground"
		>
			{children}
		</Button>
	);
}

export function CameraToolbar({
	camera,
	settings,
	onChange,
	mode,
	locked = false,
}: {
	camera: Camera;
	settings: CameraSettings;
	onChange: (patch: Partial<CameraSettings>) => void;
	mode: "photo" | "video";
	/** Disables controls that would restart the stream (e.g. while recording). */
	locked?: boolean;
}) {
	const { dict } = useI18n();
	const nextTimer = TIMER_OPTIONS[(TIMER_OPTIONS.indexOf(settings.timer) + 1) % TIMER_OPTIONS.length];
	const audioOn = settings.audio && (camera.status !== "ready" || camera.hasAudio);

	return (
		<div className="flex items-center justify-center gap-1 rounded-full border bg-background/80 p-1 shadow-xs">
			{camera.canSwitch && (
				<ToolbarButton
					label={dict.camera.switchCamera}
					disabled={locked}
					onClick={() => onChange({ deviceId: camera.nextCameraId() })}
				>
					<SwitchCamera />
				</ToolbarButton>
			)}
			<ToolbarButton
				label={dict.camera.mirror}
				pressed={settings.mirrored}
				onClick={() => onChange({ mirrored: !settings.mirrored })}
			>
				<FlipHorizontal2 />
			</ToolbarButton>
			{mode === "photo" && (
				<ToolbarButton
					label={
						settings.timer
							? format(dict.camera.timerValue, { seconds: settings.timer })
							: dict.camera.timerOff
					}
					pressed={settings.timer > 0}
					onClick={() => onChange({ timer: nextTimer })}
				>
					{settings.timer ? (
						<span className="flex items-center gap-0.5 text-xs font-semibold">
							<Timer />
							{settings.timer}
						</span>
					) : (
						<TimerOff />
					)}
				</ToolbarButton>
			)}
			{mode === "video" && (
				<ToolbarButton
					label={audioOn ? dict.camera.micOn : dict.camera.micOff}
					pressed={audioOn}
					disabled={locked}
					onClick={() => onChange({ audio: !settings.audio })}
				>
					{audioOn ? <Mic /> : <MicOff />}
				</ToolbarButton>
			)}
		</div>
	);
}
