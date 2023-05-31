package com.mohaeng.backend.place.domain;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.mohaeng.backend.common.BaseTimeEntity;
import com.mohaeng.backend.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Review extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String nickname;
    private String title;
    private String content;
    private String rating;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createdDate;

    @OneToMany(mappedBy = "review", cascade = CascadeType.REMOVE)
    private List<ReviewImage> reviewImageList = new ArrayList<>();

    public void addReviewImage(ReviewImage reviewImage) {
        this.reviewImageList.add(reviewImage);
    }

    public void update(String title, String content, String rating) {
        this.title = title;
        this.content = content;
        this.rating = rating;
    }

    public Review(Place place, String rating) {
        this.place = place;
        this.rating = rating;
    }

}
