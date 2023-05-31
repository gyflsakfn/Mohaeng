package com.mohaeng.backend.course.domain;

import com.mohaeng.backend.common.BaseTimeEntity;
import com.mohaeng.backend.course.dto.request.CourseReq;
import com.mohaeng.backend.course.dto.request.CourseUpdateReq;
import com.mohaeng.backend.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Where(clause = "deleted_date is NULL")
public class Course extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long id;

    @OneToMany(mappedBy = "course")
    @ToString.Exclude
    private List<CoursePlace> coursePlaces = new ArrayList<>();

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
    @Column(nullable = false)
    private String title;
    private String region;
    private String courseDays;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String content;
    private Integer likeCount;
    @Enumerated(EnumType.STRING)
    private CourseStatus courseStatus;
    private String thumbnailUrl;

    @Builder
    public Course(List<CoursePlace> coursePlaces, Member member, String title, String region, String courseDays, LocalDateTime startDate, LocalDateTime endDate,
                  LocalDateTime deletedDate, String content, Integer likeCount, CourseStatus courseStatus, String thumbnailUrl) {
        this.coursePlaces = coursePlaces;
        this.member = member;
        this.title = title;
        this.region = region;
        this.courseDays = courseDays;
        this.startDate = startDate;
        this.endDate = endDate;
        this.deletedDate = deletedDate;
        this.content = content;
        this.likeCount = likeCount;
        this.courseStatus = courseStatus;
        this.thumbnailUrl = thumbnailUrl;
    }

    public void addCoursePlaces(List<CoursePlace> data){
        this.coursePlaces = data;
    }

    public static Course createCourse(CourseReq req, Member member){
        return Course.builder()
                .title(req.getTitle())
                .startDate(strToTime(req.getStartDate()))
                .endDate(strToTime(req.getEndDate()))
                .courseStatus(changeStatus(req.getIsPublished()))
                .courseDays(req.getCourseDays())
                .region(req.getRegion())
                .thumbnailUrl(req.getThumbnailUrl())
                .content(req.getContent())
                .likeCount(0)
                .member(member)
                .build();
    }

    public void updateCourse(CourseUpdateReq courseUpdateReq) {
        this.title = courseUpdateReq.getTitle();
        this.startDate = strToTime(courseUpdateReq.getStartDate());
        this.endDate = strToTime(courseUpdateReq.getEndDate());
        this.courseDays = courseUpdateReq.getCourseDays();
        this.region = courseUpdateReq.getRegion();
        this.thumbnailUrl = courseUpdateReq.getThumbnailUrl();
        this.content = courseUpdateReq.getContent();
        this.courseStatus = changeStatus(courseUpdateReq.getIsPublished());
    }

    public void updateDeletedDate(List<CoursePlace> coursePlaces){
        this.deletedDate = LocalDateTime.now();
        for (CoursePlace coursePlace : coursePlaces) {
            coursePlace.updateDeletedDate();
        }
    }

    public void addLikeCount(){
        this.likeCount += 1;
    }

    public void cancelLikeCount(){
        this.likeCount -= 1;
    }

    /** String 타입 날짜를 LocaDateTime으로 변환 **/
    private static LocalDateTime strToTime (String strDate){
        LocalDate date = LocalDate.parse(strDate);
        return date.atStartOfDay();
    }

    /** 코스 공개 비공개 여부 확인 후 Enum 타입으로 변환 **/
    public static CourseStatus changeStatus(Boolean status){
        return status ? CourseStatus.PUBLIC : CourseStatus.PRIVATE;
    }

    public void changeCourseStatus(CourseStatus courseStatus) {
        this.courseStatus = courseStatus;
    }
}