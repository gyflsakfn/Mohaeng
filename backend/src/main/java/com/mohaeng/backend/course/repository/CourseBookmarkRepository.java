package com.mohaeng.backend.course.repository;

import com.mohaeng.backend.course.domain.Course;
import com.mohaeng.backend.course.domain.CourseBookmark;
import com.mohaeng.backend.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseBookmarkRepository extends JpaRepository<CourseBookmark, Long> {
    boolean existsCourseBookmarkByMemberAndCourse(Member member, Course course);
    boolean existsCourseBookmarkByMemberAndId(Member member, Long id);
    CourseBookmark findByMemberAndCourse(Member member, Course course);
    List<CourseBookmark> findAllByCourse(Course course);
}
