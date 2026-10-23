"use client";
import type { ReactNode } from "react";
import { FlipHorizontal2, Mic, MicOff, SwitchCamera, Timer, TimerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import type { Camera } from "@/hooks/use-camera";
import { TIMER_OPTIONS, type CameraSettings } from "@/hooks/use-camera-settings";
import { format } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

type Size = "md" | "lg";

// Touch targets stay at least 44px; tablets get a little more room.
const SIZES: Record<Size, string> = {
	md: "size-11 [&_svg:not([class*='size-'])]:size-5",
	lg: "size-12 [&_svg:not([class*='size-'])]:size-6",
};

function ToolbarButton({
	label,
	pressed,
	disabled,
	onClick,
	size = "md",
	className,
	children,
}: {
	label: string;
	pressed?: boolean;
	disabled?: boolean;
	onClick: () => void;
	size?: Size;
	className?: string;
	children: ReactNode;
}) {
	// Native tooltip: a positioning library just for these hints would outweigh the whole toolbar.
	// Always drawn on the dark camera surface, so colors don't follow the site theme.
	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={label}
			title={label}
			aria-pressed={pressed}
			disabled={disabled}
			onClick={onClick}
			className={cn(
				"rounded-full text-white hover:bg-white/15 hover:text-white focus-visible:ring-white/50 aria-pressed:text-amber-300 dark:hover:bg-white/15",
				SIZES[size],
				className
			)}
		>
			{children}
		</Button>
	);
}

export function SwitchCameraButton({
	camera,
	onChange,
	locked = false,
	size,
	className,
}: {
	camera: Camera;
	onChange: (patch: Partial<CameraSettings>) => void;
	locked?: boolean;
	size?: Size;
	className?: string;
}) {
	const { dict } = useI18n();
	return (
		<ToolbarButton
			label={dict.camera.switchCamera}
			disabled={locked}
			size={size}
			className={className}
			onClick={() => onChange({ deviceId: camera.nextCameraId() })}
		>
			<SwitchCamera />
		</ToolbarButton>
	);
}

export function CameraToolbar({
	camera,
	settings,
	onChange,
	mode,
	locked = false,
	withSwitch = true,
	size,
	className,
}: {
	camera: Camera;
	settings: CameraSettings;
	onChange: (patch: Partial<CameraSettings>) => void;
	mode: "photo" | "video";
	/** Disables controls that would restart the stream (e.g. while recording). */
	locked?: boolean;
	/** Phones and tablets show the switch button next to the shutter instead. */
	withSwitch?: boolean;
	size?: Size;
	className?: string;
}) {
	const { dict } = useI18n();
	const nextTimer = TIMER_OPTIONS[(TIMER_OPTIONS.indexOf(settings.timer) + 1) % TIMER_OPTIONS.length];
	const audioOn = settings.audio && (camera.status !== "ready" || camera.hasAudio);

	return (
		<div className={cn("flex items-center justify-center gap-1", className)}>
			{withSwitch && camera.canSwitch && (
				<SwitchCameraButton camera={camera} onChange={onChange} locked={locked} size={size} />
			)}
			<ToolbarButton
				label={dict.camera.mirror}
				pressed={settings.mirrored}
				size={size}
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
					size={size}
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
					size={size}
					onClick={() => onChange({ audio: !settings.audio })}
				>
					{audioOn ? <Mic /> : <MicOff />}
				</ToolbarButton>
			)}
		</div>
	);
}
