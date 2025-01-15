package com.stream.app.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "my_videos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video {


    @Id
    private String videoId;

    private String title;

    private String description;

    private String contentType;

    private String filePath;

    private Integer views;

    private Date postedAt;

    private Integer duration;

    private String thumbnailPath;

    private String thumbnailContentType;

    private String videoUrl;

//    @ManyToOne
//    private  Course course;

}
