"use client";
import { useI18n } from "@/components/i18n-provider";
import { ShutterButton, type ShellProps } from "@/components/camera/camera-controls";
import { CameraToolbar } from "@/components/camera/camera-toolbar";
import { Viewfinder } from "@/components/camera/viewfinder";
import MediaGallery from "@/components/gallery/media-gallery";

/**
 * Windowed camera for computers, in the style of desktop camera apps: a large preview
 * with a control bar underneath. The page header (capture layout) holds navigation.
 */
export function DesktopShell({
	mode,
	camera,
	settings,
	onSettingsChange,
	library,
	capture,
	locked = false,
	overlay,
	status,
}: ShellProps) {
	const { dict } = useI18n();

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			<div className="flex min-h-80 flex-1 flex-col overflow-hidden rounded-2xl border bg-black text-white shadow-lg">
				<Viewfinder
					camera={camera}
					mirrored={settings.mirrored}
					overlay={overlay}
					status={status}
					statusClassName="top-4 justify-start px-4"
					className="min-h-0 flex-1"
				/>
				<div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-white/10 bg-neutral-950 px-4 py-3">
					<CameraToolbar
						camera={camera}
						settings={settings}
						onChange={onSettingsChange}
						mode={mode}
						locked={locked}
						className="justify-self-start rounded-full bg-white/10 p-1"
					/>
					<ShutterButton
						mode={mode}
						{...capture}
						title={`${capture.label} (${dict.camera.shortcut})`}
						className="size-16"
					/>
					<div className="justify-self-end">
						<MediaGallery kind={mode} library={library} disabled={locked} className="size-14" />
					</div>
				</div>
			</div>
			<p className="text-center text-xs text-muted-foreground">
				{mode === "photo" ? dict.camera.hintPhoto : dict.camera.hintVideo}
			</p>
		</div>
	);
}
