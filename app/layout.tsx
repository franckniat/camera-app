import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SwitchTheme from "@/components/switch-theme";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react"

const monaSans = Mona_Sans({
	variable: "--font-mona-sans",
	subsets: ["latin"],
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
		<html lang="fr" suppressHydrationWarning>
			<body
				className={`${monaSans.className} antialiased`}
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
