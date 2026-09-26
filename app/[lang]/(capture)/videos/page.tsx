import type { Metadata } from "next";
import { CameraLoader } from "@/components/camera/camera-loader";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/videos">): Promise<Metadata> {
	const lang = (await params).lang as Locale;
	return { title: getDictionary(lang).gallery.videosTitle };
}

export default function VideosPage() {
	return <CameraLoader mode="video" />;
}
