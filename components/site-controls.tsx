import LanguageSwitch from "@/components/language-switch";
import SwitchTheme from "@/components/switch-theme";
import { cn } from "@/lib/utils";

export function SiteControls({ className }: { className?: string }) {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<LanguageSwitch />
			<SwitchTheme />
		</div>
	);
}
