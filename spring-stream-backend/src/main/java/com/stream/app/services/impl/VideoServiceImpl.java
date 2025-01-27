package com.stream.app.services.impl;

import com.stream.app.entities.Video;
import com.stream.app.repositories.VideoRepository;
import com.stream.app.services.VideoService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class VideoServiceImpl implements VideoService {

    @Value("${files.video}")
    String DIR;

    @Value("${file.video.hsl}")
    String HSL_DIR;


    private VideoRepository videoRepository;


    public VideoServiceImpl(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @PostConstruct
    public void init() {

        File file = new File(DIR);


        try {
            Files.createDirectories(Paths.get(HSL_DIR));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        if (!file.exists()) {
            file.mkdir();
            System.out.println("Folder Created:");
        } else {
            System.out.println("Folder already created");
        }

    }

    @Override
    public Video save(Video video, MultipartFile file, MultipartFile thumbnailFile) {
        try {
            String filename = file.getOriginalFilename();
            String contentType = file.getContentType();
            InputStream inputStream = file.getInputStream();

            // file path
            String cleanFileName = StringUtils.cleanPath(filename);

            //folder path : create
            String cleanFolder = StringUtils.cleanPath(DIR+video.getVideoId()+"/");

            Files.createDirectories(Paths.get(cleanFolder));

            // folder path with  filename
            Path path = Paths.get(cleanFolder, cleanFileName);

            System.out.println(contentType);
            System.out.println(path);

            // copy file to the folder
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);



            // video meta data
            video.setContentType(contentType);
            video.setFilePath(path.toString());
            video.setPostedAt(new java.util.Date());

            String videoDuration = null;//getVideoDuration(path.toString());
            if(videoDuration != null){
                video.setDuration(Integer.valueOf(videoDuration));
            }

            if(thumbnailFile != null){
                savethumbnailFile(video, thumbnailFile);
            }

            Video savedVideo = videoRepository.save(video);

            //processing video
//            processVideo(savedVideo.getVideoId());

            //delete actual video file and database entry  if exception

            // metadata save
            return savedVideo;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error in processing video ");
        }


    }

    private String getVideoDuration(String videoPath){
        try {
            String ffmpegCmd = String.format("D:\\Softwares\\ffmpeg-7.1-essentials_build\\bin\\ffmpeg.exe -i \"%s\" 2>&1 | grep Duration | awk '{print $2}' | tr -d ,", videoPath.toString());
        ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", ffmpegCmd);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String duration = null;

            duration = reader.readLine();

        process.waitFor();
        return duration;
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Saves the thumbnail file for the given video.
     *
     * @param video the video entity to associate the thumbnail with
     * @param thumbnailFile the thumbnail file to save
     * @return true if the thumbnail file was saved successfully, false otherwise
     */
    public boolean savethumbnailFile(Video video, MultipartFile thumbnailFile) {
        try {
            String filename = thumbnailFile.getOriginalFilename();
            String contentType = thumbnailFile.getContentType();
            InputStream inputStream = thumbnailFile.getInputStream();

            // file path
            String cleanFileName = StringUtils.cleanPath(filename);

            //folder path : create
            String cleanFolder = StringUtils.cleanPath(DIR+video.getVideoId()+"/");

            // folder path with  filename
            Path path = Paths.get(cleanFolder, cleanFileName);

            System.out.println("thumbnail file path: " + path);
            System.out.println(contentType);

            // copy file to the folder
            long statusCount = Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);

            if(statusCount > 0){
                video.setThumbnailContentType(contentType);
                video.setThumbnailPath(path.toString());
                return true;
            }
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error in saving thumbnail file ");
        }
    }

    @Override
    public boolean delete(String videoId) {
        videoRepository.deleteById(videoId);
        return videoRepository.findById(videoId).isEmpty();
    }


    @Override
    public Video get(String videoId) {
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new RuntimeException("video not found"));
        return video;
    }

    @Override
    public Video getByTitle(String title) {
        return null;
    }

    @Override
    public List<Video> getAll() {
        return videoRepository.findAll();
    }

    @Override
    public String processVideo(String videoId) {

        Video video = this.get(videoId);
        String filePath = video.getFilePath();

        //path where to store data:
        Path videoPath = Paths.get(filePath);


        String output360p = HSL_DIR + videoId + "/360p/";
        String output720p = HSL_DIR + videoId + "/720p/";
        String output1080p = HSL_DIR + videoId + "/1080p/";

        try {
            Files.createDirectories(Paths.get(output360p));
            Files.createDirectories(Paths.get(output720p));
            Files.createDirectories(Paths.get(output1080p));

            // ffmpeg command
            Path outputPath = Paths.get(HSL_DIR, videoId);

            Files.createDirectories(outputPath);


//            String ffmpegCmd = String.format(
//                    "D:\\Softwares\\ffmpeg-7.1-essentials_build\\bin\\ffmpeg.exe -i " +
//                            "\"%s\" -c:v libx264 -c:a aac -strict -2 -f hls -hls_time 10 -hls_list_size 0 " +
//                            "-hls_segment_filename \"%s/segment_%%3d.ts\"  \"%s/master.m3u8\" ",
//                    videoPath, outputPath, outputPath
//            );
//            String ffmpegCmd = String.format(
//                    "D:\\Softwares\\ffmpeg-7.1-essentials_build\\bin\\ffmpeg.exe -i " +
//                            "\"%s\" -c:v libx264 -c:a aac -strict -2 -f hls -hls_time 10 -hls_list_size 0 " +
//                            "-map 0:v -map 0:a -s:v:0 640x360 -b:v:0 800k " +
//                            "-map 0:v -map 0:a -s:v:1 1280x720 -b:v:1 2800k " +
//                            "-map 0:v -map 0:a -s:v:2 1920x1080 -b:v:2 5000k " +
//                            "-var_stream_map \\\"v:0,a:0 v:1,a:0 v:2,a:0\\\" " +
//                            "-master_pl_name \"%s/master.m3u8\" " +
//                            "-hls_segment_filename \"%s/segment_%%3d.ts\"   ",
//                    videoPath, outputPath, outputPath
//            );
//            String ffmpegCmd = "D:\\Softwares\\ffmpeg-7.1-essentials_build\\bin\\ffmpeg.exe -i " + videoPath + " \\\n" +
//                    "  -vf \"scale=-1:360\" -c:a aac -ar 48000 -c:v h264 -b:v 800k -g 48 -hls_time 10 -hls_playlist_type vod " +
//                    "-hls_segment_filename \"" + outputPath + "/360p/segment_%03d.ts\" " +
//                    "-var_stream_map \"v:0,a:0\" " +
//                    "-f hls \"" + outputPath + "/360p/playlist.m3u8\" \\\n" +
//
//                    "  -vf \"scale=-1:720\" -c:a aac -ar 48000 -c:v h264 -b:v 2500k -g 48 -hls_time 10 -hls_playlist_type vod " +
//                    "-hls_segment_filename \"" + outputPath + "/720p/segment_%03d.ts\" " +
//                    "-var_stream_map \"v:0,a:0\" " +
//                    "-f hls \"" + outputPath + "/720p/playlist.m3u8\" \\\n" +
//
//                    "  -vf \"scale=-1:1080\" -c:a aac -ar 48000 -c:v h264 -b:v 5000k -g 48 -hls_time 10 -hls_playlist_type vod " +
//                    "-hls_segment_filename \"" + outputPath + "/1080p/segment_%03d.ts\" " +
//                    "-var_stream_map \"v:0,a:0\" " +
//                    "-f hls \"" + outputPath + "/1080p/playlist.m3u8\"\n ";

            String outputPathCmd = outputPath.toString().replace("\\", "/");
            String videoPathCmd = videoPath.toString().replace("\\", "/");
            String ffmpegCmd = "D:\\Softwares\\ffmpeg-7.1-essentials_build\\bin\\ffmpeg.exe -i " + videoPath + "" +
                    "  -vf \"scale=-1:360\" -c:a aac -ar 48000 -c:v h264 -b:v 800k -g 48 -hls_time 10 -hls_playlist_type vod " +
                    "-hls_segment_filename \"" + outputPathCmd + "/360p/segment_%03d.ts\" " +
                    "-f hls \"" + outputPathCmd + "/360p/playlist.m3u8\" " +

                    "  -vf \"scale=-1:720\" -c:a aac -ar 48000 -c:v h264 -b:v 2500k -g 48 -hls_time 10 -hls_playlist_type vod " +
                    "-hls_segment_filename \"" + outputPathCmd + "/720p/segment_%03d.ts\" " +
                    "-f hls \"" + outputPathCmd + "/720p/playlist.m3u8\" " +

                    "  -vf \"scale=-1:1080\" -c:a aac -ar 48000 -c:v h264 -b:v 5000k -g 48 -hls_time 10 -hls_playlist_type vod " +
                    "-hls_segment_filename \"" + outputPathCmd + "/1080p/segment_%03d.ts\" " +
                    "-f hls \"" + outputPathCmd + "/1080p/playlist.m3u8\" ";


//            StringBuilder ffmpegCmd = new StringBuilder();
//            ffmpegCmd.append("D:\\Softwares\\ffmpeg-7.1-essentials_build\\bin\\ffmpeg.exe  -i ")
//                    .append(videoPath.toString())
//                    .append(" -c:v libx264 -c:a aac")
//                    .append(" ")
//                    .append("-map 0:v -map 0:a -s:v:0 640x360 -b:v:0 800k ")
//                    .append("-map 0:v -map 0:a -s:v:1 1280x720 -b:v:1 2800k ")
//                    .append("-map 0:v -map 0:a -s:v:2 1920x1080 -b:v:2 5000k ")
//                    .append("-var_stream_map \"v:0,a:0 v:1,a:0 v:2,a:0\" ")
//                    .append("-master_pl_name ").append(HSL_DIR).append(videoId).append("/master.m3u8 ")
//                    .append("-f hls -hls_time 10 -hls_list_size 0 ")
//                    .append("-hls_segment_filename \"").append(HSL_DIR).append(videoId).append("/v%v/fileSequence%d.ts\" ")
//                    .append("\"").append(HSL_DIR).append(videoId).append("/v%v/prog_index.m3u8\"");


            System.out.println(ffmpegCmd);
            //file this command
            ProcessBuilder processBuilder = new ProcessBuilder("cmd.exe", "/c", ffmpegCmd);
            processBuilder.environment().put("PATH", System.getenv("PATH"));
            processBuilder.inheritIO();
            Process process = processBuilder.start();
            int exit = process.waitFor();
            if (exit != 0) {
                throw new RuntimeException("video processing failed!!");
            }

            return videoId;


        } catch (IOException ex) {
            throw new RuntimeException("Video processing fail!!");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }


    }
}
