"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export default function SwitchTheme() {
	const { resolvedTheme, setTheme } = useTheme();
	const { dict } = useI18n();
	return (
		<Button
			variant="outline"
			size="icon"
			className="relative rounded-full"
			aria-label={dict.settings.theme}
			title={dict.settings.theme}
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			<Sun className="scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
		</Button>
	);
}
