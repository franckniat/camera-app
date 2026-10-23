"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import type { Camera } from "@/hooks/use-camera";
import type { CameraSettings } from "@/hooks/use-camera-settings";
import type { MediaLibrary } from "@/hooks/use-media-library";
import type { MediaKind } from "@/lib/types";
import { cn } from "@/lib/utils";

export type CaptureControl = {
	label: string;
	disabled: boolean;
	/** Video only: a recording is in progress. */
	active?: boolean;
	onPress: () => void;
};

/** Everything a camera layout needs; photo and video modes fill it in. */
export type ShellProps = {
	mode: MediaKind;
	camera: Camera;
	settings: CameraSettings;
	onSettingsChange: (patch: Partial<CameraSettings>) => void;
	library: MediaLibrary;
	capture: CaptureControl;
	/** Set while recording: disables everything that would interrupt it. */
	locked?: boolean;
	/** Full-size layers over the preview (countdown, flash). */
	overlay?: ReactNode;
	/** Small badge over the preview (recording timer). */
	status?: ReactNode;
};

/** Round shutter in the style of native camera apps: white for photos, red for video. */
export function ShutterButton({
	mode,
	label,
	disabled,
	active = false,
	onPress,
	title,
	className,
}: CaptureControl & { mode: MediaKind; title?: string; className?: string }) {
	return (
		<button
			type="button"
			onClick={onPress}
			disabled={disabled}
			aria-label={label}
			aria-pressed={mode === "video" ? active : undefined}
			title={title ?? label}
			className={cn(
				"group grid size-18 shrink-0 place-items-center rounded-full border-4 border-white transition-transform outline-none focus-visible:ring-4 focus-visible:ring-white/50 active:scale-95 disabled:opacity-40",
				className
			)}
		>
			<span
				className={cn(
					"size-[82%] rounded-full transition-all duration-200",
					mode === "photo" && "bg-white group-active:scale-90 group-active:bg-white/80",
					mode === "video" && "bg-red-500",
					mode === "video" && active && "size-[42%] rounded-[22%]"
				)}
			/>
		</button>
	);
}

/** PHOTO / VIDEO switch shown under the preview on phones and tablets. */
export function ModeSwitch({
	mode,
	disabled = false,
	className,
}: {
	mode: MediaKind;
	disabled?: boolean;
	className?: string;
}) {
	const { lang, dict } = useI18n();
	const modes = [
		{ kind: "photo", label: dict.nav.photo },
		{ kind: "video", label: dict.nav.video },
	] as const;

	return (
		<nav
			aria-label={dict.nav.modes}
			className={cn("flex items-center justify-center gap-1", disabled && "pointer-events-none opacity-40", className)}
		>
			{modes.map(({ kind, label }) => (
				<Link
					key={kind}
					href={`/${lang}/${kind}s`}
					replace
					aria-current={kind === mode ? "page" : undefined}
					aria-disabled={disabled || undefined}
					tabIndex={disabled ? -1 : undefined}
					className="rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.15em] text-white/70 uppercase transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 aria-[current=page]:bg-white/15 aria-[current=page]:text-amber-300"
				>
					{label}
				</Link>
			))}
		</nav>
	);
}
