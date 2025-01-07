import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SwitchTheme from "@/components/switch-theme";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react"

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

const dmMono = DM_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	weight: "500",
});

export const metadata: Metadata = {
	title: "Web camera app",
	description: "A simple web camera app that allows you to take pictures and record videos.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body
				className={`${dmSans.className} ${dmMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<SwitchTheme />
					<Toaster richColors closeButton />
					<Analytics/>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
