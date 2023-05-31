package com.mohaeng.backend.member.service;

import com.mohaeng.backend.course.domain.CourseBookmark;
import com.mohaeng.backend.course.repository.CourseBookmarkRepository;
import com.mohaeng.backend.exception.badrequest.NotMatchMemberCourseBookMark;
import com.mohaeng.backend.exception.badrequest.NotMatchMemberPlaceBookMark;
import com.mohaeng.backend.exception.badrequest.NotMatchMemberReview;
import com.mohaeng.backend.exception.notfound.CourseBookmarkNotFoundException;
import com.mohaeng.backend.exception.notfound.MemberNotFoundException;
import com.mohaeng.backend.exception.notfound.ReviewNotFoundException;
import com.mohaeng.backend.member.domain.Member;
import com.mohaeng.backend.member.dto.response.MyPageCourseBookMarkDto;
import com.mohaeng.backend.member.dto.response.MyPagePlaceBookMarkDto;
import com.mohaeng.backend.member.dto.response.MyPageReviewDto;
import com.mohaeng.backend.member.repository.MemberRepository;
import com.mohaeng.backend.place.domain.PlaceBookmark;
import com.mohaeng.backend.place.domain.Review;
import com.mohaeng.backend.place.repository.PlaceBookmarkRepository;
import com.mohaeng.backend.place.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyPageService {
    private final CourseBookmarkRepository courseBookmarkRepository;
    private final MemberRepository memberRepository;
    private final PlaceBookmarkRepository placeBookmarkRepository;
    private final ReviewRepository reviewRepository;


    @Transactional
    public List<MyPageCourseBookMarkDto> findAllBookMarkCourse(String email) {
        Member member = isMember(email);
        for (CourseBookmark courseBookmark : member.getCourseBookMarkList()) {
            log.info("courseBookmarkId = {}", courseBookmark.getId());
        }

        return member.getCourseBookMarkList().stream()
                .map(bookmark -> MyPageCourseBookMarkDto.of(bookmark))
                .sorted(Comparator.comparing(MyPageCourseBookMarkDto::getCreatedDate).reversed())
                .collect(Collectors.toList());
    }

    public Member isMember(String email) {
        return memberRepository.findByEmailAndDeletedDateIsNull(email)
                .orElseThrow(() -> new MemberNotFoundException());
    }

    @Transactional
    public MyPageCourseBookMarkDto findOneBookMarkedCourse(String email, Long bookMarkId) {
        Member member = isMember(email);
        CourseBookmark courseBookMark = isCourseBookMark(bookMarkId);

        //현재의 Member가 가진 북마크가맞는지 확인
        if (!isBookmarkByMemberAndId(member, bookMarkId)) {
            throw new NotMatchMemberCourseBookMark();
        }

        MyPageCourseBookMarkDto data = MyPageCourseBookMarkDto.of(courseBookMark);
        return data;
    }

    public boolean isBookmarkByMemberAndId(Member member, Long bookMarkId) {
        List<CourseBookmark> courseBookMarkList = member.getCourseBookMarkList();
        for (CourseBookmark courseBookmark : courseBookMarkList) {
            if (courseBookmark.getId() == bookMarkId) {
                return true;
            }
        }
        return false;
    }

    public CourseBookmark isCourseBookMark(Long bookMarkId) {
        return courseBookmarkRepository.findById(bookMarkId)
                .orElseThrow(() -> new CourseBookmarkNotFoundException());
    }

    @Transactional
    public List<MyPagePlaceBookMarkDto> findAllBookMarkedPlace(String email) {
        Member member = isMember(email);
        return member.getPlaceBookmarkList().stream()
                .map(m -> MyPagePlaceBookMarkDto.of(m))
                .sorted(Comparator.comparing(MyPagePlaceBookMarkDto :: getCreatedDate).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public MyPagePlaceBookMarkDto findOneBookMarkedPlace(String email, Long bookMarkPlaceId) {
        Member member = isMember(email);
        PlaceBookmark placeBookMark = isPlaceBookMark(bookMarkPlaceId);

        //현재의 Member가 가진 장소북마크가맞는지 확인
        if (!isPlaceBookMarkByMember(member, bookMarkPlaceId)) {
            throw new NotMatchMemberPlaceBookMark();
        }

        return MyPagePlaceBookMarkDto.of(placeBookMark);
    }

    public PlaceBookmark isPlaceBookMark(Long id) {
        return placeBookmarkRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException());
    }

    public boolean isPlaceBookMarkByMember(Member member, Long bookMarkPlaceId) {
        for (PlaceBookmark placeBookmark : member.getPlaceBookmarkList()) {
            if (placeBookmark.getId() == bookMarkPlaceId) {
                return true;
            }
        }
        return false;
    }

    public void updateDeletedDate(Member member){
        memberRepository.delete(member);
    }

    @Transactional
    public List<MyPageReviewDto> getAllMyReview(String email) {
        Member member = isMember(email);
        return member.getReviewList().stream()
                .map(m -> MyPageReviewDto.of(m))
                .sorted(Comparator.comparing(MyPageReviewDto::getCreatedDate).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public MyPageReviewDto getOneMyReview(String email, long reviewId) {
        Member member = isMember(email);
        Review review = isReview(reviewId);
        System.out.println("review = " + review.getPlace().getFirstImage());
        System.out.println("review = " + review.getPlace().getName());
        System.out.println("review = " + review.getPlace().getId());

        if (!isMemberHasReview(member, review)) {
            throw new NotMatchMemberReview();
        }

        return MyPageReviewDto.of(review);
    }

    public Review isReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException());
    }

    public boolean isMemberHasReview(Member member, Review review) {
        for (Review findReview : member.getReviewList()) {
            if (review.getId() == findReview.getId()) {
                return true;
            }
        }
        return false;
    }
}