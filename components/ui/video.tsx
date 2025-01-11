export function Video({src, height, width, className}: {src: string, height: number, width: number, className: string}) {
    return (
        <video width={width} className={className} height={height} controls preload="none">
            <source src={src} type="video/webm" />
            <track
                kind="subtitles"
                srcLang="en"
                label="English"
            />
            Your browser does not support the video tag.
        </video>
    )
}