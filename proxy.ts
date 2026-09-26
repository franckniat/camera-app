import { NextResponse, type NextRequest } from "next/server";
import { isLocale, localeCookie, matchLocale } from "@/lib/i18n/config";

/** Sends unprefixed URLs (including the pre-i18n /photos and /videos) to the visitor's language. */
export function proxy(request: NextRequest) {
	const saved = request.cookies.get(localeCookie)?.value;
	const lang = isLocale(saved) ? saved : matchLocale(request.headers.get("accept-language"));
	const url = request.nextUrl.clone();
	url.pathname = `/${lang}${url.pathname === "/" ? "" : url.pathname}`;
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/", "/photos", "/videos"],
};
