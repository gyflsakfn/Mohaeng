package com.mohaeng.backend.course.service;

import com.mohaeng.backend.course.domain.*;
import com.mohaeng.backend.course.dto.*;
import com.mohaeng.backend.course.dto.request.*;
import com.mohaeng.backend.course.dto.response.*;
import com.mohaeng.backend.course.repository.CourseBookmarkRepository;
import com.mohaeng.backend.course.repository.CourseLikesRepository;
import com.mohaeng.backend.course.repository.CoursePlaceRepository;
import com.mohaeng.backend.course.repository.CourseRepository;
import com.mohaeng.backend.exception.badrequest.InvalidKeywordPlaceInCourse;
import com.mohaeng.backend.exception.notfound.CourseNotFoundException;
import com.mohaeng.backend.exception.notfound.MemberNotFoundException;
import com.mohaeng.backend.exception.notfound.PlaceNotFoundException;
import com.mohaeng.backend.exception.unauthrized.MemberPermissionDenied;
import com.mohaeng.backend.member.domain.Member;
import com.mohaeng.backend.member.repository.MemberRepository;
import com.mohaeng.backend.place.domain.Place;
import com.mohaeng.backend.place.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CourseService {

    private final PlaceRepository placeRepository;
    private final MemberRepository memberRepository;
    private final CourseRepository courseRepository;
    private final CoursePlaceRepository coursePlaceRepository;
    private final CourseLikesRepository courseLikesRepository;
    private final CourseBookmarkRepository courseBookmarkRepository;

    public CoursePlaceSearchRes placeSearch(CoursePlaceSearchReq req, Pageable pageable) {
        // keyword에 null이 담겨있을 때
        if (req.getKeyword() == null){
            throw new InvalidKeywordPlaceInCourse();
        }

        // rating에 점수가 담겨있지 않을 때
        double rating = req.parseRatingToDouble(req.getLastRating());

        Slice<Place> places = placeRepository.findPlaceInCourse(req.getKeyword(), req.getLastId(), rating, pageable);

        List<CoursePlaceSearchDto> coursePlaceSearchList = places.stream()
                .map(place -> CoursePlaceSearchDto.from(place))
                .collect(Collectors.toList());
        return CoursePlaceSearchRes.from(places.hasNext(), coursePlaceSearchList);
    }

    @Transactional
    public CourseIdRes createCourse(CourseReq req,String memberEmail) {

        // 1.유저 확인
        Member member = isMember(memberEmail);

        // 2. 코스 생성
        Course course = Course.createCourse(req, member);

        List<CoursePlace> coursePlaces = new ArrayList<>();
        for (Long id : req.getPlaceIds()) {
            Place place = placeRepository.findById(id).orElseThrow(PlaceNotFoundException::new);
            coursePlaces.add(
                    CoursePlace.builder()
                            .course(course)
                            .place(place)
                            .build()
            );
        }

        Course createdCourse = courseRepository.save(course);
        coursePlaceRepository.saveAll(coursePlaces);

        createdCourse.addCoursePlaces(coursePlaces);

        return CourseIdRes.from(createdCourse.getId());
    }

    public CourseRes getCourse(Long courseId, String memberEmail) {
        // 1.로그인 유무 화인
        Member member = isLogin(memberEmail);

        // 2. courseId로 course 조회
        Course findCourse = isCourse(courseId);

        // 3. courseId로 CoursePlace 조회
        List<CoursePlace> coursePlaces = coursePlaceRepository.findAllByCourseId(courseId);
        List<CourseInPlaceDto> courseInPlaceDtoList = new ArrayList<>();

        // 4. CoursePlaces에 담긴 Place 정보를 사용해 CourseInPlaceDTO에 담아준다.
        for (CoursePlace coursePlace : coursePlaces) {
            Place place = coursePlace.getPlace();
            courseInPlaceDtoList.add(
                    CourseInPlaceDto.builder()
                            .placeId(place.getId())
                            .name(place.getName())
                            .imgUrl(place.getFirstImage())
                            .address(place.getAddress())
                            .mapX(place.getMapX())
                            .mapY(place.getMapY())
                            .build()
            );
        }

        Boolean isLiked = false;
        Boolean isBookmarked = false;

        if (member != null){
            isLiked = courseLikesRepository.existsCourseLikesByMemberAndCourse(member, findCourse);
            isBookmarked = courseBookmarkRepository.existsCourseBookmarkByMemberAndCourse(member, findCourse);
        }

        return CourseRes.from(findCourse, courseInPlaceDtoList, isLiked, isBookmarked);
    }

    @Transactional
    public CourseIdRes updateCourse(String memberEmail, Long courseId, CourseUpdateReq req) {

        // 1. 코스 존재 여부 & 작성자와 요청자가 같은지 확인
        Course course = isCourse(courseId);
        isWriter(memberEmail, course.getMember());

        // 2. 기존에 존재하던 CoursePlaces 삭제
        List<CoursePlace> coursePlaces = coursePlaceRepository.findAllByCourseId(courseId);
        for (CoursePlace coursePlace : coursePlaces) {
            coursePlace.updateDeletedDate();
        }
        coursePlaces.clear();

        for (Long id : req.getPlaceIds()) {
            Place place = placeRepository.findById(id).orElseThrow(PlaceNotFoundException::new);
            coursePlaces.add(
                    CoursePlace.builder()
                            .course(course)
                            .place(place)
                            .build()
            );
        }

        coursePlaceRepository.saveAll(coursePlaces);
        course.addCoursePlaces(coursePlaces);
        course.updateCourse(req);

        return CourseIdRes.from(course.getId());
    }

    @Transactional
    public void deleteCourse(String memberEmail, Long courseId) {

        // 1. 코스 존재 여부 확인
        Course course = isCourse(courseId);

        // 2. 작성자와 요청자가 같은지 확인
        isWriter(memberEmail, course.getMember());

        // 3-1. course 좋아요 & 북마크 soft delete 처리
        List<CourseLikes> likesAllByCourse = courseLikesRepository.findAllByCourse(course);
        for (CourseLikes courseLikes : likesAllByCourse) {
            courseLikes.updateDeletedDate();
        }

        List<CourseBookmark> bookmarksAllByCourse1 = courseBookmarkRepository.findAllByCourse(course);
        for (CourseBookmark courseBookmark : bookmarksAllByCourse1) {
            courseBookmark.updateDeletedDate();
        }

        // 3-2. course soft delete 처리
        course.updateDeletedDate(course.getCoursePlaces());
    }

    public CourseListRes getCourseList(CourseSearchDto courseSearchDto, Pageable pageable, String memberEmail) {
        // 1. 로그인 유무 확인
        Member member = isLogin(memberEmail);
        Long memberId = 0L;
        if (member != null){
            memberId = member.getId();
        }

        // 2. 코스 조회 결과 불러오기기
        Page<CourseListDto> results = courseRepository.findAllCourseWithBookmarkAndLikes(courseSearchDto, pageable, memberId);

        return CourseListRes.from(results.getContent(), results.getTotalElements(), results.getTotalPages());
    }


    public List<MainCourseListDto> getMainCourse(String memberEmail) {
        // 1. 로그인 유무 확인
        Member member = isLogin(memberEmail);
        Long memberId = 0L;
        if (member != null){
            memberId = member.getId();
        }

        // 2. 코스 조회 결과 불러오기기
        List<MainCourseListDto> results = courseRepository.findTop10Course(memberId);

        return results;
    }


    private Member isWriter(String memberEmail, Member writer){
        Member member = isMember(memberEmail);

        if(!member.getEmail().equals(writer.getEmail())){
            throw new MemberPermissionDenied();
        }
        return member;

    }

    private Member isLogin(String email){
        return isNull(email) ? null : memberRepository.findByEmailAndDeletedDateIsNull(email).orElseThrow(MemberNotFoundException::new);
    }

    private Member isMember(String memberEmail){
        return memberRepository.findByEmailAndDeletedDateIsNull(memberEmail).orElseThrow(MemberNotFoundException::new);
    }

    private Course isCourse(Long id){
        return courseRepository.findById(id).orElseThrow(CourseNotFoundException::new);
    }
}