package com.mohaeng.backend.course.repository;

import com.mohaeng.backend.course.domain.Course;
import com.mohaeng.backend.course.domain.CourseLikes;
import com.mohaeng.backend.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseLikesRepository extends JpaRepository<CourseLikes, Long> {
    boolean existsCourseLikesByMemberAndCourse(Member member, Course course);
    CourseLikes findByMemberAndCourse(Member member, Course course);
    Long countByCourse(Course course);
    List<CourseLikes> findAllByCourse(Course course);
}
