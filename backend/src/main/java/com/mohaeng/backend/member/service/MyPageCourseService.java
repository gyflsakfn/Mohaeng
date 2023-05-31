package com.mohaeng.backend.member.service;

import com.mohaeng.backend.course.domain.Course;
import com.mohaeng.backend.course.repository.CourseRepository;
import com.mohaeng.backend.exception.badrequest.NotMatchMemberCourse;
import com.mohaeng.backend.exception.notfound.CourseNotFoundException;
import com.mohaeng.backend.exception.notfound.MemberNotFoundException;
import com.mohaeng.backend.member.domain.Member;
import com.mohaeng.backend.member.dto.request.VisibilityRequest;
import com.mohaeng.backend.member.dto.response.MyPageCourseDto;
import com.mohaeng.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyPageCourseService {
    private final CourseRepository courseRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public List<MyPageCourseDto> findAllMyCourse(String email) {
        Member member = isMember(email);
        return member.getCourseList().stream()
                .map(m -> MyPageCourseDto.of(m))
                .sorted(Comparator.comparing(MyPageCourseDto::getCreatedDate).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public MyPageCourseDto findOneMyCourse(String email, long courseId) {
        Member member = isMember(email);
        Course course = isCourseId(courseId);

        if (!isMemberHasCourse(member, course)) {
            throw new NotMatchMemberCourse();
        }

        return MyPageCourseDto.of(course);
    }

    @Transactional
    public void changeVisibility(String email, long courseId, VisibilityRequest visibilityRequest) {
        Member member = isMember(email);
        Course course = isCourseId(courseId);

        if (!isMemberHasCourse(member, course)) {
            throw new NotMatchMemberCourse();
        }

        course.changeCourseStatus(course.changeStatus(visibilityRequest.getIsPublished()));
        courseRepository.save(course);
    }

    private boolean isMemberHasCourse(Member member, Course course) {
        for (Course findCourse : member.getCourseList()) {
            if (findCourse.getId() == course.getId()) {
                return true;
            }
        }
        return false;
    }

    private Course isCourseId(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException());
    }

    private Member isMember(String email) {
        return memberRepository.findByEmailAndDeletedDateIsNull(email)
                .orElseThrow(() -> new MemberNotFoundException());
    }
}