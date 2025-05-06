/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Button } from "./ui/button";
import { Download, Image as ImageIcon, Trash } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useLocalStorage } from "usehooks-ts";
import {Video} from "@/components/ui/video";

type Videos = {
    src: string | null;
    date: Date;
};

export default function GalleryVideos({ videos }: { videos: Videos[] }) {
    const [videosStored, setVideos, removeVideos] = useLocalStorage<Videos[]>(
        "videos",
        []
    );

    const handleDownload = (src: string) => {
        const link = document.createElement("a");
        link.href = src;
        link.download = `video-${new Date().getTime()}.jpeg`;
        link.click();
    };
    const handleDeleteOneVideo = (date: Date) => {
        const item = videos.find((video) => video.date === date);
        if (item) {
            setVideos(videosStored.filter((video) => video.date !== item.date));
        }
    };
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        title="View gallery"
                        variant={"outline"}
                    >
                        <ImageIcon size={25} />
                        Your videos
                    </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Gallery</SheetTitle>
                        <SheetDescription>
                            {videos.length} Vidoes in the gallery
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid grid-cols-1  gap-2 mt-5 mb-12 relative">
                        {videos.map((video, index) => (
                            <div key={index} className="relative group">
                                <Video
                                    src={video.src || ""}
                                    height={500}
                                    width={500}
                                    className="rounded-sm border border-foreground/20 sm:w-full sm:h-[300px]"
                                />
                                <div className={"flex justify-between gap-3 items-center mt-2"}>
                                    {/* <Button onClick={()=>handleDownload} variant={"secondary"}>
                                        <Download size={18}/>
                                        Download
                                    </Button> */}
                                    <Button
                                        size={"icon"}
                                        title="Delete picture"
                                        variant={"destructive"}
                                        onClick={() => handleDeleteOneVideo(video.date)}
                                    >
                                        <Trash size={15} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="fixed bottom-0 w-full bg-background/90 backdrop-blur px-2 py-3">
                            <Button
                                onClick={removeVideos}
                                title="Clear all pictures"
                                variant={"destructive"}
                                className="gap-2 justify-end"
                            >
                                <Trash size={25} /> Delete all
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
