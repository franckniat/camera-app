import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex items-center justify-center min-h-screen gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="max-w-[800px] mx-auto px-3">
				<div className="flex items-center flex-col gap-4">
					<span className="text-3xl sm:text-5xl">📸</span>
					<h1 className="text-4xl font-extrabold text-center">
						Welcome to the web camera app
					</h1>
					<p className="text-lg sm:text-xl mt-5 text-center max-w-3xl">
						This is a simple web camera app that allows you to take
						pictures and record videos.
					</p>
					<div className="flex sm:flex-row flex-col items-center justify-center gap-5 my-10 w-full">
						<Link href={"/photos"} className="w-full sm:w-fit">
							<Button size={"lg"} className="w-full sm:w-fit">Get Started</Button>
						</Link>
						<Link href={"https://github.com/franckniat/camera-app"} target="_blank" className="w-full sm:w-fit">
							<Button size={"lg"} variant={"secondary"} className="gap-2 w-full sm:w-fit"><Github/> Contribute</Button>
						</Link>
					</div>
					<div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-5">
						<Link href={"https://fndev.vercel.app/about"} className="hover:underline font-medium text-foreground/80 text-sm sm:text-base flex justify-center">
							Coded with ❤️ by Franck NIAT
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
