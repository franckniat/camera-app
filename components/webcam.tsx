/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useCallback, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";
import { CameraIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from 'usehooks-ts'
import GalleryPhotos from "./gallery";
import { useMediaQuery } from 'usehooks-ts'


type Photos = {
    src: string | null;
    date: Date;
}

export default function WebCameraComponent() {
	const videoConstraints = {
		facingMode: "user",
	};
	const isOnMobile = useMediaQuery('(min-width: 600px)')
	const camera = useRef<Webcam | null>(null);
    const [photos, setPhotos, _] = useLocalStorage<Photos[]>("photos", []);
	const capture = useCallback(() => {
		const imageSrc = camera.current ? camera.current.getScreenshot() : null;
        if (photos.length >= 10) {
			toast.error("You can't take more than 10 photos.");
			return;
		}else {
			setPhotos([...photos, {src: imageSrc, date: new Date()}]);
        toast.success("Image captured successfully");
		}
	}, [camera, photos, setPhotos]);

	return (
		<div className={"flex flex-col gap-4 items-center"}>
			<Webcam
				audio={false}
				videoConstraints={videoConstraints}
				screenshotFormat="image/jpeg"
				ref={camera}
				className="rounded-md border-2 border-primary/50 max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-100px)]"
				style={{ height : isOnMobile ? "700px" : "500px"}}
				onUserMediaError={() => {}}
				onUserMedia={() => {}}
				screenshotQuality={1}
			/>
			<div className="py-3 px-2 flex justify-center items-center gap-4">
				<Button onClick={capture} title="Take a picture" size={"camera"}>
					<CameraIcon size={25} />
				</Button>
                {photos.length > 0 && <GalleryPhotos photos={photos}/>}
			</div>
		</div>
	);
}
