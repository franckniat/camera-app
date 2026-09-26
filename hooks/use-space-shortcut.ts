"use client";
import { useEffect, useEffectEvent } from "react";

const INTERACTIVE = "button, a, input, textarea, select, [contenteditable], [role=dialog]";

/** Runs `action` when Space is pressed, unless focus is on a control or a dialog is open. */
export function useSpaceShortcut(action: () => void) {
	const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
		if (event.code !== "Space" || event.repeat || event.defaultPrevented) return;
		const target = event.target as Element | null;
		if (target?.closest(INTERACTIVE) || document.querySelector("[role=dialog]")) return;
		event.preventDefault();
		action();
	});

	useEffect(() => {
		const listener = (event: KeyboardEvent) => onKeyDown(event);
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	}, []);
}
