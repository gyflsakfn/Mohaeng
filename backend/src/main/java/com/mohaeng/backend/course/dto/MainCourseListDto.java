package com.mohaeng.backend.course.dto;

import com.mohaeng.backend.course.domain.Course;
import lombok.*;

import java.util.stream.Collectors;

@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MainCourseListDto {
    private Long courseId;
    private String title;
    private String thumbnailUrl;
    private String content;
    private int likeCount;
    private String region;
    private String courseDays;
    private Boolean isBookmarked;
    private Boolean isLiked;

    @Builder
    public MainCourseListDto(Long courseId, String title, String thumbnailUrl,
                             int likeCount, String content, String region, String courseDays, Boolean isBookmarked, Boolean isLiked) {
        this.courseId = courseId;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.likeCount = likeCount;
        this.content = content;
        this.region = region;
        this.courseDays = courseDays;
        this.isBookmarked = isBookmarked;
        this.isLiked = isLiked;
    }

}
