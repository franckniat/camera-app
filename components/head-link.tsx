"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function HeadLink() {
    const pathname = usePathname()
    return (
        <div className={"flex items-center justify-center w-fit h-10 bg-foreground/5 p-1 my-6 rounded-md text-sm"}>
            <Link href={"/photos"} className={`px-3 rounded-md h-8 flex items-center ${pathname==="/photos" && "bg-foreground/10 shadow"}`}>Photo</Link>
            <Link href={"/videos"} className={`px-3 rounded-md h-8 flex items-center ${pathname ==="/videos" && "bg-foreground/10 shadow"}`}>Video</Link>
        </div>
    )
}