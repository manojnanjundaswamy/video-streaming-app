import { useEffect, useRef, useState } from "react"
import { formatDuration } from "../utils/formatDuration"
import { formatTimeAgo } from "../utils/formatTimeAgo"
import React from "react"

type VideoGridItemProps = {
  id: string
  title: string
  channel: {
    id: string
    name: string
    profileUrl: string
  }
  views: number
  postedAt: Date
  duration: number
  thumbnailUrl: string
  videoUrl: string
}


const VIEW_FORMATTER = new Intl.NumberFormat(undefined, { notation: "compact" })

export const VideoGridItem = ({playVideo, video}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  // console.log(video.id);

  const handlePlayVideo = () => {
    playVideo(video.id)
  }

  useEffect(() => {
    if (videoRef.current == null) return

    if (isVideoPlaying) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [isVideoPlaying])

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsVideoPlaying(true)}
      onMouseLeave={() => setIsVideoPlaying(false)}
    >
      <a className="relative aspect-video" onClick={handlePlayVideo} style={{maxHeight: "fit-content"}}>
        <img
          src={video.thumbnailUrl}
          className={`block w-full h-full object-cover transition-[border-radius] duration-200 
            ${isVideoPlaying ? "rounded-none" : "rounded-xl"
          }`}
        />
        <div className="absolute bottom-1 right-1 bg-secondary-dark text-secondary text-sm px-0.5 rounded">
          {formatDuration(video.duration)}
        </div>
        <video
          className={`block h-full object-cover absolute inset-0 transition-opacity duration-200 
            ${isVideoPlaying ? "opacity-100 delay-200" : "opacity-0"
          }`}
          ref={videoRef}
          muted
          playsInline
          src={video.videoUrl}
        />
      </a>
      <div className="flex gap-2">
        <a href={`/@${video.channel.id}`} className="flex-shrink-0">
          <img className="w-12 h-12 rounded-full" src={video.channel.profileUrl} />
        </a>
        <div className="flex flex-col">
          <a href={`/watch?v=${video.id}`} className="font-bold">
            {video.title}
          </a>
          <a href={`/@${video.channel.id}`} className="text-secondary-text text-sm">
            {video.channel.name}
          </a>
          <div className="text-secondary-text text-sm">
            {VIEW_FORMATTER.format(video.views)} Views • {formatTimeAgo(video.postedAt)}
          </div>
        </div>
      </div>
    </div>
  )
};

