import { useEffect, useState } from "react";
import "./App.css";
import VideoUpload from "./components/VideoUpload";
import VideoPlayer from "./components/VideoPlayer";
import { SidebarProvider } from "./contexts/SidebarContext";
import { PageHeader } from "./layouts/PageHeader";
import { VideoGridItem } from "./components/VideoGridItem";
import Modal from "./components/Modal";
import axios from "axios";
import { toast, ToastContainer, Zoom } from "react-toastify";
import {videos as videoMeta} from "./data/home"

function App() {
  const [videoId, setVideoId] = useState(
    "1f58a8b9-c0c0-4de6-9031-229e6414ca00"
  );

  const [showModal, setShowModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleVideoOpenModal = () => {
    setShowVideoModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchVideos();
    setVideoPlaying(false);
  };

  const handleVideoCloseModal = () => {
    setShowVideoModal(false);
    // fetchVideos();
    setVideoPlaying(false);
  };

  const playVideo = (videoId) => {
    setVideoId(videoId);
    handleVideoOpenModal();
    console.log(videoId);
    setVideoPlaying(true);
  };

  
  const deleteVideo = (videoId) => {
    console.log("In Delete Video");
    var confirmed = window.confirm("Are you sure you want to delete this video?");
    if (!confirmed) {
      return;
    }
    deleteVideoFromServer(videoId);
  }

  async function deleteVideoFromServer(videoId) {
    let response = await axios.delete(
      `http://localhost:8080/api/v1/videos/${videoId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(response);
    if(response.status === 200){
      console.log(`inside response status ${response.data.message}`);
      // alert(response.data.message);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
        });
      fetchVideos();
    }else{
      toast.error("Error while deleting!!. Please try again", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
        });
    }

  }

  useEffect(() => {
    fetchVideos();
    setVideoPlaying(false);
  }, []);

  async function fetchVideos() {
    const response = await fetch("http://localhost:8080/api/v1/videos");
    const data = await response.json();
    console.log(data);
    var i = 0;
    const videos = data.map((video) => {
      var fileName = new String(video.filePath);
      fileName = fileName.split(/[/\\]/).pop();
      
      var videoMetaData = videoMeta[i];
      i++;
      if(i > videoMeta.length){
        i=0;
      } 
      return {
        id: video.videoId,
        title: video.title,
        channel: {
          name: videoMetaData.channel.name,
          id: videoMetaData.channel.id,
          profileUrl: videoMetaData.channel.profileUrl,
          // name: "GrimLive",
          // id: "grimLive",
          // profileUrl:
          //   "https://yt3.ggpht.com/HVKmWEzK-Zv7XFefBYYc6RAem2MZg9kApjxgng9YPvgz7GjPVvMD7UdLpoWMB8WC551RRjCzMw=s68-c-k-c0x00ffffff-no-rj",
        },
        views: videoMetaData.views,
        postedAt: videoMetaData.postedAt,
        duration: videoMetaData.duration,
        thumbnailUrl: `http://localhost:8080/api/v1/videos/getThumbnail/${video.videoId}`,
        videoUrl: `http://localhost:8080/api/v1/videos/stream/range/${video.videoId}`,
        fileName: fileName,
      };
    });
    setVideos(videos);
  }

  return (
    <>
  
    <div className="overflow-auto">
      <SidebarProvider>
      <ToastContainer />
        <div className="max-h-screen flex flex-col">
          <PageHeader onClick={handleOpenModal} />

          <Modal
            show={showModal}
            onClose={handleCloseModal}
            title="Upload Video"
            size="70"
          >
            <VideoUpload onCancleButtonClick={handleCloseModal} />
          </Modal>

          <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
            <Modal
              show={showVideoModal}
              onClose={handleVideoCloseModal}
              title={`${videos.find((video) => video.id === videoId)?.fileName}`}
              size="70"
            >
                  <VideoPlayer
                    // src={`http://localhost:8080/api/v1/videos/${videoId}/master.m3u8`}
                    src={`http://localhost:8080/api/v1/videos/stream/range/${videoId}`}
                    videoEnded={handleVideoCloseModal}
                  ></VideoPlayer>
            </Modal>

            <div className="w-full px-4 sm:px-6 lg:px-8 pb-10">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {videos.map((video) => (
                  <VideoGridItem
                    playVideo={playVideo}
                    deleteVideo={deleteVideo}
                    key={video.id}
                    video={video}
                  />
                ))}
              </div>
              {videos.length === 0 && (
                <div className="grid grid-cols-1 p-20 w-full h-1 font-bold text-center">
                  {" "}
                  No videos found <br /> Start Uploading
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
    </>
  );
}

export default App;
