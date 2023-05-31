package com.mohaeng.backend.course.service;

import com.mohaeng.backend.course.domain.Course;
import com.mohaeng.backend.course.domain.CourseLikes;
import com.mohaeng.backend.course.dto.response.CourseLikesRes;
import com.mohaeng.backend.course.repository.CourseLikesRepository;
import com.mohaeng.backend.course.repository.CourseRepository;
import com.mohaeng.backend.exception.badrequest.InvalidCourseLikes;
import com.mohaeng.backend.exception.notfound.CourseLikesNotFoundException;
import com.mohaeng.backend.exception.notfound.CourseNotFoundException;
import com.mohaeng.backend.exception.notfound.MemberNotFoundException;
import com.mohaeng.backend.member.domain.Member;
import com.mohaeng.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CourseLikesService {

    private final CourseLikesRepository courseLikesRepository;
    private final MemberRepository memberRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public CourseLikesRes addLikes(Long courseId, String memberEmail) {
        // 1. 로그인 하지 않은 유저 확인
        Member member = isMember(memberEmail);
        // 2. 존재하지 않는 Course 인지 확인
        Course course = isCourse(courseId);

        // 3. 이미 좋아요를 누른 회원인지 확인
        if (isExistLikes(member, course)){throw new InvalidCourseLikes();}

        // 4. CourseLikes 저장
        courseLikesRepository.save(CourseLikes.of(member, course));

        // 5. course의 likeCount 증가
        course.addLikeCount();
        Long totalLikes = getTotalLikes(course);

        return CourseLikesRes.from(courseId, totalLikes);
    }

    @Transactional
    public CourseLikesRes cancelLikes(Long courseId, String memberEmail) {
        // 1. 로그인 하지 않은 유저 확인
        Member member = isMember(memberEmail);
        // 2. 존재하지 않는 Course 인지 확인
        Course course = isCourse(courseId);

        // 3. 이미 좋아요를 누른 회원인지 확인
        if (!isExistLikes(member, course)) {
            throw new CourseLikesNotFoundException();
        }

        // 4. 해당 CourseLikes 찾아서, deletedDate update & Course likeCount 감소
        CourseLikes courseLikes = courseLikesRepository.findByMemberAndCourse(member, course);
        courseLikes.updateDeletedDate();
        course.cancelLikeCount();

        Long totalLikes = getTotalLikes(course);

        return CourseLikesRes.from(courseId, totalLikes);
    }


    public CourseLikesRes countLikes(Long courseId) {

        // 존재하지 않는 Course 인지 확인
        Course course = isCourse(courseId);
        Long totalLikes = getTotalLikes(course);

        return CourseLikesRes.from(courseId, totalLikes);
    }

    private Long getTotalLikes(Course course) {
        return courseLikesRepository.countByCourse(course);
    }


    public boolean isExistCourseLikes(Long courseId, String memberEmail) {
        // 1. 유저 확인 & Course 확인
        Member member = isMember(memberEmail);
        Course course = isCourse(courseId);

        return isExistLikes(member, course);
    }

    private boolean isExistLikes(Member member, Course course) {
        return courseLikesRepository.existsCourseLikesByMemberAndCourse(member, course);
    }

    private Member isMember(String memberEmail){
        return memberRepository.findByEmailAndDeletedDateIsNull(memberEmail).orElseThrow(MemberNotFoundException::new);
    }

    private Course isCourse(Long id){
        return courseRepository.findById(id).orElseThrow(CourseNotFoundException::new);
    }


}