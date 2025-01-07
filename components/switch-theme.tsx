"use client";
import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function SwitchTheme() {
	const { theme, setTheme } = useTheme();
	return (
		<div className="fixed bottom-5 right-4">
			<Button
				variant={"secondary"}
				size={"icon"}
				className="w-12 h-12 rounded-full relative hover:scale-105 transition-all active:scale-95 border border-foreground/20"
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			>
				<Moon className="absolute scale-0 dark:scale-100 rotate-6 dark:rotate-0" />
				<Sun className="scale-100 dark:scale-0 rotate-0 dark:rotate-6" />
			</Button>
		</div>
	);
}
