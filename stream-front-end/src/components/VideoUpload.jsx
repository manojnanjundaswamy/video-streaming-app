import React, { useState } from "react";
import PropTypes from "prop-types";
import videoLogo from "../assets/video-posting.png";
import {
  Card,
  Label,
  TextInput,
  Textarea,
  Progress,
} from "flowbite-react";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";



VideoUpload.propTypes = {
  onCancleButtonClick: PropTypes.func.isRequired,
};

function VideoUpload(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbNailFile, setThumbNailFile] = useState(null);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  //Function call back
  const handleClickClose = () => {
    resetForm();
    props.onCancleButtonClick();
  };

  function handleFileChange(event) {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }

  function handleThumbnailFileChange(event) {
    console.log(event.target.files[0]);
    setThumbNailFile(event.target.files[0]);
  }

  function formFieldChange(event) {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
  }

  function handleForm(formEvent) {
    formEvent.preventDefault();
    if (!selectedFile || !thumbNailFile || !meta.title || !meta.description) {
      toast.warn("Please fill all the fields !!");
      return;
    }
    //submit the file to server:
    saveVideoToServer(selectedFile, meta);
  }

  function resetForm() {
    setMeta({
      title: "",
      description: "",
    });
    setSelectedFile(null);
    setThumbNailFile(null);
    setUploading(false);
  }

  //submit file to server
  async function saveVideoToServer(video, videoMetaData) {
    setUploading(true);

    //api call
    try {
      let formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("file", selectedFile);
      formData.append("thumbnailFile", thumbNailFile);

      let response = await axios.post(
        `http://localhost:8080/api/v1/videos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            console.log(progress);
            setProgress(progress);
          },
        }
      );

      console.log(response);
      setProgress(0);

      setUploading(false);
      toast.success("File uploaded: " + response.data.videoId, {
          position: "top-center",
          autoClose: "8000",
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      resetForm();
      setTimeout(() => {
        handleClickClose();
      }, 5000);
    } catch (error) {
      console.log(error);
      setUploading(false);
      toast.error("File not uploaded!, please try again");
    }
  }

  return (
    <div className="">
      <ToastContainer />
      <Card className="">
        <div>
          <form noValidate className="grid " onSubmit={handleForm}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="max-w-md ">
                <div className="mb-2 block">
                  <Label htmlFor="file-upload" value="Video Title" />
                  <span className="text-red-500">*</span>
                </div>
                <TextInput
                  value={meta.title}
                  onChange={formFieldChange}
                  name="title"
                  placeholder="Enter title"
                />
              </div>
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="file-upload" value="Upload Video Thumbnail" />
                  <span className="text-red-500">*</span>
                </div>
                <div className="shrink-0">
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    accept="image/jpeg,image/png,image/bmp,image/gif"
                    onChange={handleThumbnailFileChange}
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    JPEG, PNG, BMP, or GIF.
                  </p>
                </div>
              </div>
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="comment" value="Video Description" />
                  <span className="text-red-500">*</span>
                </div>
                <Textarea
                  value={meta.description}
                  onChange={formFieldChange}
                  name="description"
                  id="comment"
                  placeholder="Write video description..."
                  required
                  rows={4}
                />
              </div>
              <div className="max-w-md">
                <Label htmlFor="comment" value="Upload Video file" />
                <span className="text-red-500">*</span>
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <img
                      className="h-16 w-16 object-cover "
                      src={videoLogo}
                      alt="Current profile photo"
                    />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      MP4, WebM, Ogg etc..
                    </p>
                  </div>
                  {selectedFile != null && (
                    <p className="dark:text-gray-400 font: message-box;   color: cornflowerblue;">
                      Selected File: {selectedFile.name}
                    </p>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="">
                {uploading && (
                  <Progress
                    color="green"
                    progress={progress}
                    size={"md"}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={uploading}
                style={{ width: "10%" }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 py-2.5 px-5 me-2 mb-2 "
              >
                Submit
              </button>
              <div className="mx-2"></div>
              <button
                type="button"
                onClick={() => handleClickClose()}
                style={{ width: "10%" }}
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 py-2.5 px-5 me-2 mb-2 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default VideoUpload;
