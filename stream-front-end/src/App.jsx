import { useEffect, useState } from "react";
import "./App.css";
import VideoUpload from "./components/VideoUpload";
import VideoPlayer from "./components/VideoPlayer";
import { CSSTransition } from "react-transition-group";
import { SidebarProvider } from "./contexts/SidebarContext";
import { PageHeader } from "./layouts/PageHeader";
import { VideoGridItem } from "./components/VideoGridItem";
import Modal from "./components/Modal";

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

  useEffect(() => {
    fetchVideos();
    setVideoPlaying(false);
  }, []);

  async function fetchVideos() {
    const response = await fetch("http://localhost:8080/api/v1/videos");
    const data = await response.json();
    console.log(data);

    const videos = data.map((video) => {
      var fileName = new String(video.filePath);
      fileName = fileName.split(/[/\\]/).pop();
      console.log("FileNMame");
      console.log(fileName);

      return {
        id: video.videoId,
        title: video.title,
        channel: {
          name: "GrimLive",
          id: "grimLive",
          profileUrl:
            "https://yt3.ggpht.com/HVKmWEzK-Zv7XFefBYYc6RAem2MZg9kApjxgng9YPvgz7GjPVvMD7UdLpoWMB8WC551RRjCzMw=s68-c-k-c0x00ffffff-no-rj",
        },
        views: 6700,
        postedAt: new Date("2023-08-29"),
        duration: 938,
        thumbnailUrl: `http://localhost:8080/api/v1/videos/getThumbnail/${video.videoId}`,
        videoUrl: `http://localhost:8080/api/v1/videos/stream/range/${video.videoId}`,
        fileName: fileName,
      };
    });
    setVideos(videos);
  }

  return (
    <div className="overflow-auto">
      <SidebarProvider>
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
              title={`Playing Video: ${videos.find((video) => video.id === videoId)?.fileName}`}
              size="70"
            >
                  <VideoPlayer
                    // src={`http://localhost:8080/api/v1/videos/${videoId}/master.m3u8`}
                    src={`http://localhost:8080/api/v1/videos/stream/range/${videoId}`}
                  ></VideoPlayer>
            </Modal>

            <div className="w-full px-4 sm:px-6 lg:px-8 pb-10">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {videos.map((video) => (
                  <VideoGridItem
                    playVideo={playVideo}
                    key={video.videoId}
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
  );
}

export default App;
