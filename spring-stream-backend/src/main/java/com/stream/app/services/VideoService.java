package com.stream.app.services;


import com.stream.app.entities.Video;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

public interface VideoService {

    //save  video
    Video save(Video video, MultipartFile file, MultipartFile thumbnailFile);

    // get video by  id
    Video get(String videoId);


    // get video by title

    Video getByTitle(String title);

    List<Video> getAll();


    //video processing
    String processVideo(String videoId);

    public boolean savethumbnailFile(Video video, MultipartFile thumbnailFile);


}
