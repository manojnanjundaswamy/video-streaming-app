import { useEffect, useRef, useState } from "react";
import { formatDuration } from "../utils/formatDuration";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import React from "react";

type VideoGridItemProps = {
  id: string;
  title: string;
  channel: {
    id: string;
    name: string;
    profileUrl: string;
  };
  views: number;
  postedAt: Date;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
};

const VIEW_FORMATTER = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export const VideoGridItem = ({ playVideo, deleteVideo, video }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isDeletePressed, setIsDeletePressed] = useState(false);
  // console.log(video.id);

  const handlePlayVideo = () => {
    if(isDeletePressed) {
      console.log("Delete button clicked!");
      deleteVideo(video.id);
    } else {
      playVideo(video.id);
    }
    
  };


  useEffect(() => {
    if (videoRef.current == null) return;

    if (isVideoPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsVideoPlaying(true)}
      onMouseLeave={() => setIsVideoPlaying(false)}
    >
      <a
        className="relative aspect-video"
        onClick={handlePlayVideo}
        style={{ maxHeight: "fit-content" }}
      >
        <img
          src={video.thumbnailUrl}
          className={`block w-full h-full object-cover transition-[border-radius] duration-200 
            ${isVideoPlaying ? "rounded-none" : "rounded-xl"}`}
        />
        <div className="absolute bottom-1 right-1 bg-secondary-dark text-secondary text-sm px-0.5 rounded">
          {formatDuration(video.duration)}
        </div>
        <video
          className={`block h-full object-cover absolute inset-0 transition-opacity duration-200 
            ${isVideoPlaying ? "opacity-100 delay-200" : "opacity-0"}`}
          ref={videoRef}
          muted
          playsInline
          src={video.videoUrl}
        />
        
        <div className="absolute top-1 right-1 bg-secondary-dark text-secondary text-sm px-0.5 rounded" onMouseLeave={() => setIsDeletePressed(false)} onMouseOver={() => setIsDeletePressed(true)}>
          <button
            onClick={() => setIsDeletePressed(true)}
            // className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-white hover:border-b-red-500 transition-colors duration-300"
            aria-label="Close"
          ><svg className="w-3 h-3 text-white hover:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg></button>
        </div>
        
      </a>
      
      <div className="flex gap-2">
        <a href={`/@${video.channel.id}`} className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full"
            src={video.channel.profileUrl}
          />
        </a>
        <div className="flex flex-col">
          <a href={`/watch?v=${video.id}`} className="font-bold">
            {video.title}
          </a>
          <a
            href={`/@${video.channel.id}`}
            className="text-secondary-text text-sm"
          >
            {video.channel.name}
          </a>
          <div className="text-secondary-text text-sm">
            {VIEW_FORMATTER.format(video.views)} Views •{" "}
            {formatTimeAgo(video.postedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};
