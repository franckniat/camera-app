import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
	title: "Web camera app",
	description:
		"A simple web camera app that allows you to take pictures and record videos.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="max-w-[1280px] mx-auto px-3">
			<div className="absolute top-5 left-5">
				<Link href={"/"} className="flex items-center gap-3 hover:bg-foreground/10 px-3 py-2 rounded-md">
					<ArrowLeft size={18} />
					<span>Back to home</span>
				</Link>
			</div>
			<div className="h-screen flex items-center">{children}</div>
		</div>
	);
}
