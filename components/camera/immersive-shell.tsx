"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { ModeSwitch, ShutterButton, type ShellProps } from "@/components/camera/camera-controls";
import { CameraToolbar, SwitchCameraButton } from "@/components/camera/camera-toolbar";
import { Viewfinder } from "@/components/camera/viewfinder";
import MediaGallery from "@/components/gallery/media-gallery";
import { cn } from "@/lib/utils";

/**
 * Full-screen camera for phones and tablets, laid out like their native camera apps:
 * controls along the bottom when held upright, along the right edge when held sideways.
 * Phones get solid bars around the preview; tablets float translucent controls over it.
 */
export function ImmersiveShell({
	device,
	mode,
	camera,
	settings,
	onSettingsChange,
	library,
	capture,
	locked = false,
	overlay,
	status,
}: ShellProps & { device: "phone" | "tablet" }) {
	const { lang, dict } = useI18n();
	const tablet = device === "tablet";
	const size = tablet ? "lg" : "md";

	const backLink = (
		<Link
			href={`/${lang}`}
			aria-label={dict.nav.back}
			title={dict.nav.back}
			className={cn(
				"grid shrink-0 place-items-center rounded-full text-white transition-colors outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60",
				tablet ? "size-12 bg-black/40 backdrop-blur-md" : "size-11"
			)}
		>
			<ChevronLeft className="size-6" />
		</Link>
	);

	const toolbar = (
		<CameraToolbar
			camera={camera}
			settings={settings}
			onChange={onSettingsChange}
			mode={mode}
			locked={locked}
			withSwitch={false}
			size={size}
			className="portrait:flex-row landscape:flex-col"
		/>
	);

	const viewfinder = (
		<Viewfinder
			camera={camera}
			mirrored={settings.mirrored}
			overlay={overlay}
			status={status}
			statusClassName={tablet ? "portrait:top-24 landscape:top-6" : undefined}
			swipe={{ mode, disabled: locked }}
			className={tablet ? "absolute inset-0" : "min-h-0 min-w-0 flex-1"}
		/>
	);

	// Gallery, shutter, switch: a row when upright, a column (gallery at the bottom) when sideways.
	// The two side slots share the leftover space equally, which keeps the shutter centered.
	const controls = (
		<div className="flex flex-1 items-center portrait:flex-row landscape:flex-col-reverse">
			<div className="flex flex-1 items-center justify-center">
				<MediaGallery
					kind={mode}
					library={library}
					disabled={locked}
					sheetSide={tablet ? "right" : "bottom"}
					className={tablet ? "size-16" : "size-12 rounded-lg"}
				/>
			</div>
			<ShutterButton mode={mode} {...capture} className={tablet ? "size-20" : "size-18"} />
			<div className="flex flex-1 items-center justify-center">
				{camera.canSwitch && (
					<SwitchCameraButton
						camera={camera}
						onChange={onSettingsChange}
						locked={locked}
						size={size}
						className="bg-white/15"
					/>
				)}
			</div>
		</div>
	);

	const modeSwitch = <ModeSwitch mode={mode} disabled={locked} className="portrait:flex-row landscape:flex-col" />;

	if (tablet) {
		return (
			<div className="fixed inset-0 touch-manipulation overscroll-none bg-black text-white select-none">
				{viewfinder}
				<div className="absolute top-[max(env(safe-area-inset-top),1rem)] left-[max(env(safe-area-inset-left),1rem)]">
					{backLink}
				</div>
				<div className="absolute rounded-full bg-black/40 p-1 backdrop-blur-md portrait:top-[max(env(safe-area-inset-top),1rem)] portrait:left-1/2 portrait:-translate-x-1/2 landscape:top-1/2 landscape:left-[max(env(safe-area-inset-left),1rem)] landscape:-translate-y-1/2">
					{toolbar}
				</div>
				<div className="absolute flex gap-3 bg-black/40 backdrop-blur-md portrait:inset-x-0 portrait:bottom-0 portrait:h-auto portrait:flex-col portrait:px-8 portrait:pt-4 portrait:pb-[max(env(safe-area-inset-bottom),1.5rem)] landscape:inset-y-0 landscape:right-0 landscape:flex-row landscape:py-8 landscape:pr-[max(env(safe-area-inset-right),1rem)] landscape:pl-3">
					{modeSwitch}
					<div className="flex portrait:h-24 landscape:w-24">{controls}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 flex touch-manipulation overscroll-none bg-black text-white select-none portrait:flex-col landscape:flex-row">
			<div className="box-content flex shrink-0 items-center justify-between portrait:h-14 portrait:px-2 portrait:pt-[env(safe-area-inset-top)] landscape:w-14 landscape:flex-col landscape:py-2 landscape:pl-[env(safe-area-inset-left)]">
				{backLink}
				{toolbar}
				{/* Same size as the back link, so the toolbar sits in the middle. */}
				<span className="size-11" aria-hidden />
			</div>
			{viewfinder}
			<div className="box-content flex shrink-0 gap-2 portrait:flex-col portrait:px-4 portrait:pt-3 portrait:pb-[max(env(safe-area-inset-bottom),1.25rem)] landscape:flex-row landscape:py-3 landscape:pr-[env(safe-area-inset-right)] landscape:pl-1">
				{modeSwitch}
				<div className="flex portrait:h-22 landscape:w-22">{controls}</div>
			</div>
		</div>
	);
}
