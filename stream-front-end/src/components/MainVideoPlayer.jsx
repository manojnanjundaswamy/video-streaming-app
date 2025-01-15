import React from "react";
import VideoPlayer from "./VideoPlayer";

function MainVideoPlayer() {
  return (
    <div>
      {/* <div className="flex mt-1 w-full ">
        <div className="w-3/4 bg-gray-900 p-4 rounded-lg"> */}

          {/* {<video
                  style={{
                    width: "100%",
                  }}
                  // src={`http://localhost:8080/api/v1/videos/stream/range/${videoId}`}
                  // src="http://localhost:8080/api/v1/videos/stream/9908e25d-dedc-4552-b4f8-e3d58e8d9054"
                  src={`http://localhost:8080/api/v1/videos/stream/range/${videoId}`}
                  controls
                ></video>} */}

          {
            <div>
              
            </div>
          }

          {/* <video
                  id="my-video"
                  class="video-js"
                  controls
                  preload="auto"
                  width="640"
                  height="264"
                  data-setup="{}"
                >
                  <source
                    src={`http://localhost:8080/api/v1/videos/stream/range/${videoId}`}
                    type="video/mp4"
                  />
    
                  <p class="vjs-no-js">
                    To view this video please enable JavaScript, and consider
                    upgrading to a web browser that
                    <a
                      href="https://videojs.com/html5-video-support/"
                      target="_blank"
                    >
                      supports HTML5 video
                    </a>
                  </p>
                </video>  */}
        </div>
    //   </div>
    // </div>
  );
}

export default MainVideoPlayer;
