import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import videojs from "video.js";
import Hls from "hls.js";
import "video.js/dist/video-js.css";
import { Bounce, toast, Zoom } from "react-toastify";


VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  videoEnded: PropTypes.func.isRequired,
};

function VideoPlayer(props) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

 

  useEffect(() => {
    //for init

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      muted: false,
      preload: "auto",
      download: true,
      aspectRatio: '16:9',
      fluid: true,
      responsive: true,
      enableDocumentPictureInPicture: false,
    });

    playerRef.current.on("ended", () => {
      // setTimeout(() => {
        

      // }, 2500);
      setTimeout(() => {
        console.log("Video has ended");
        props.videoEnded();
      }, 3500);
    });

    // if (Hls.isSupported()) {
    //   const hls = new Hls();
    //   hls.loadSource(src);
    //   hls.attachMedia(videoRef.current);
    //   hls.on(Hls.Events.MANIFEST_PARSED, () => {
    //     videoRef.current.play();
    //   });
    // } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
    //   videoRef.current.src = src;
    //   videoRef.current.addEventListener("canplay", () => {
    //     videoRef.current.play();
    //   });
    // } else {
      videoRef.current.src = props.src;
      videoRef.current.play();
      // console.log("video format not supportted");
      // toast.error("Video format not supporteds");
    // }
  }, [props.src]);

  return (
    <div>
      <div data-vjs-player>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "100%",
          }}
          className="video-js vjs-control-bar"
        ></video>
      </div>
    </div>
  );
}

export default VideoPlayer;
