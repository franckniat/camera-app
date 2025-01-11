"use client";
import React from 'react';
import Webcam from "react-webcam";
import {Button} from "@/components/ui/button";
import {CirclePlay, CircleStop} from "lucide-react";
import GalleryVideos from "@/components/gallery-video";
import {useLocalStorage, useMediaQuery} from "usehooks-ts";

type Videos = {
    src: string | null;
    date: Date;
};

export default function WebcamVideo() {
    const webcamRef = React.useRef<Webcam | null>(null);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const isOnMobile = useMediaQuery('(min-width: 600px)')
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [videosStored, setVideos, _] = useLocalStorage<Videos[]>(
        "videos",
        []
    );
    const videoConstraints = {
        facingMode: "user",
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const handleDataAvailable = React.useCallback(({data}) => {
        if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
        }
    }, [setRecordedChunks]);

    const handleStartCaptureClick = React.useCallback(() => {
        setCapturing(true);
        if (webcamRef.current?.stream) {
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: "video/webm"
            });
            mediaRecorderRef.current.addEventListener(
                "dataavailable",
                handleDataAvailable
            );
            mediaRecorderRef.current.start();
        }

    }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);


    const handleStopCaptureClick = React.useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            setVideos([...videosStored, {src: URL.createObjectURL(blob), date: new Date()}]);
        }
        setCapturing(false);
    }, [recordedChunks, setVideos, videosStored]);

    /*const handleDownload = React.useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);*/

    return (
        <div className={"flex flex-col gap-4 items-center"}>
            <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                screenshotQuality={1}
                className="rounded-md border-2 border-primary/50 max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-100px)]"
                style={{ height : isOnMobile ? "700px" : "500px"}}
            />
            <div className={"flex items-center gap-3 justify-center my-6"}>
                {capturing ? (
                    <Button onClick={handleStopCaptureClick} variant={"outline"}>
                        <CircleStop size={18} className={"animate-pulse text-red-600"}/>
                        Stop recording
                    </Button>
                ) : (
                    <Button onClick={handleStartCaptureClick} className={"gap-3"}>
                        <CirclePlay size={18}/>
                        Start recording
                    </Button>
                )}
                {videosStored.length > 0 && <GalleryVideos videos={videosStored}/>}
            </div>
        </div>
    );
}