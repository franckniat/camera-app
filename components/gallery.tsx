import React from "react";
import { Button } from "./ui/button";
import { Download, Image as ImageIcon, Trash } from "lucide-react";
import Image from "next/image";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useLocalStorage } from "usehooks-ts";

type Photos = {
	src: string | null;
	date: Date;
};

export default function GalleryPhotos({ photos }: { photos: Photos[] }) {
	const [pictures, setPhotos, removePhotos] = useLocalStorage<Photos[]>(
		"photos",
		[]
	);

	const handleDownload = (src: string) => {
		const link = document.createElement("a");
		link.href = src;
		link.download = `photo-${new Date().getTime()}.jpeg`;
		link.click();
	};
	const handleDeleteOnePicture = (date: Date) => {
		const item = photos.find((photo) => photo.date === date);
		if (item) {
			setPhotos(pictures.filter((photo) => photo.date !== item.date));
		}
	};
	return (
		<>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						title="View gallery"
						variant={"outline"}
						size={"camera"}
					>
						<ImageIcon size={25} />
					</Button>
				</SheetTrigger>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Gallery</SheetTitle>
						<SheetDescription>
							{photos.length} photos in the gallery
						</SheetDescription>
					</SheetHeader>
					<div className="grid grid-cols-1  gap-2 mt-5 mb-12 relative">
						{photos.map((photo, index) => (
							<div key={index} className="relative group">
								<Image
									src={photo.src || ""}
									alt={`photo-${index}`}
									height={500}
									width={500}
									className="rounded-sm border border-foreground/20 sm:w-full sm:h-[300px] group-hover:opacity-70 object-cover"
								/>
								<Button
									size={"icon"}
									title="Download picture"
									className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
									onClick={() =>
										handleDownload(photo.src || "")
									}
								>
									<Download size={15} />
								</Button>
								<Button
									size={"icon"}
									title="Delete picture"
									variant={"destructive"}
									onClick={() => handleDeleteOnePicture(photo.date)}
									className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
								>
									<Trash size={15} />
								</Button>
							</div>
						))}
						<div className="fixed bottom-0 w-full bg-background/90 backdrop-blur px-2 py-3">
							<Button
								onClick={removePhotos}
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
