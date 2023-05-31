package com.mohaeng.backend.course.service;

import com.mohaeng.backend.course.domain.CourseBookmark;
import com.mohaeng.backend.course.dto.request.CourseReq;
import com.mohaeng.backend.course.dto.response.CourseIdRes;
import com.mohaeng.backend.exception.badrequest.InvalidCourseBookmark;
import com.mohaeng.backend.exception.notfound.CourseBookmarkNotFoundException;
import com.mohaeng.backend.exception.notfound.CourseNotFoundException;
import com.mohaeng.backend.exception.notfound.MemberNotFoundException;
import com.mohaeng.backend.member.domain.Member;
import com.mohaeng.backend.member.domain.Role;
import com.mohaeng.backend.member.repository.MemberRepository;
import com.mohaeng.backend.place.domain.Place;
import com.mohaeng.backend.place.repository.PlaceRepository;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class CourseBookmarkServiceTest {

    @Autowired CourseBookmarkService courseBookmarkService;
    @Autowired CourseService courseService;
    @Autowired PlaceRepository placeRepository;
    @Autowired MemberRepository memberRepository;

    @BeforeAll
    public void before(){
        Place place1 = Place.builder()
                .name("경복궁")
                .address("서울시 종로구")
                .firstImage("images/01.jpg")
                .rating(4.5)
                .build();

        Place place2 = Place.builder()
                .name("부산 경복궁")
                .address("부산시 해운대구")
                .firstImage("images/02.jpg")
                .rating(4.3)
                .build();

        placeRepository.saveAll(Lists.list(place1, place2));
    }

    @AfterEach
    void afterEach() {
//        memberRepository.deleteAll();
    }

    @Test
    @Transactional
    @DisplayName("코스 북마크 - 정상 처리")
    public void addCourseBookmark() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("addCourseBookmark");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();

        //When
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());

        //Then
        Member member = memberRepository.findByEmailAndDeletedDateIsNull(savedMember.getEmail()).orElseThrow(null);
        List<CourseBookmark> courseBookMarkList = member.getCourseBookMarkList();
        assertEquals(1, courseBookMarkList.size());
    }

    @Test
    @DisplayName("코스 북마크 - 로그인 하지 않은 경우 예외 처리")
    public void addCourseBookmark_not_member() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("addCourseBookmarkNotmem");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();

        //When
        Exception exception = assertThrows(MemberNotFoundException.class, () -> {
            courseBookmarkService.addBookmark(courseId, "null@null.com");
        });

        //Then
        assertEquals("회원을 찾을 수 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("코스 북마크 - 코스가 존재하지 않는 경우 예외 처리")
    public void addCourseBookmark_courseId_null() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("addCourseBookmarksNullId");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        //When
        Exception exception = assertThrows(CourseNotFoundException.class, () -> {
            courseBookmarkService.addBookmark(1000L, savedMember.getEmail());
        });

        //Then
        assertEquals("코스를 찾을 수 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("코스 뷱마크 - 이미 북마크를 누른 경우 예외 처리")
    public void addCourseBookmark_already_likes() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("addCourseBookmarkAlready");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();

        // 좋아요 처리
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());

        //When
        Exception exception = assertThrows(InvalidCourseBookmark.class, () -> {
            courseBookmarkService.addBookmark(courseId, savedMember.getEmail());
        });

        //Then
        assertEquals("이미 북마크에 추가된 코스입니다.", exception.getMessage());
    }

    @Test
    @Transactional
    @DisplayName("코스 북마크 취소 - 정상 처리")
    public void cancelCourseBookmark() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("cancelBookmark");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());

        //When
        courseBookmarkService.cancelBookmark(courseId, savedMember.getEmail());

        //Then
        Member member = memberRepository.findByEmailAndDeletedDateIsNull(savedMember.getEmail()).orElseThrow(null);
        List<CourseBookmark> courseBookMarkList = member.getCourseBookMarkList();
        assertEquals(0, courseBookMarkList.size());
    }

    @Test
    @DisplayName("코스 북마크 취소 - 로그인 하지 않은 경우 예외 처리")
    public void cancelCourseBookmark_not_member() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("cancelBookmarkNotMem");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());

        //When
        Exception exception = assertThrows(MemberNotFoundException.class, () -> {
            courseBookmarkService.cancelBookmark(courseId, "null@null.com");
        });

        //Then
        assertEquals("회원을 찾을 수 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("코스 북마크 취소- 코스가 존재하지 않는 경우 예외 처리")
    public void cancelCourseBookmark_courseId_null() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("cancelBookmarkNoId");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());

        //When
        Exception exception = assertThrows(CourseNotFoundException.class, () -> {
            courseBookmarkService.cancelBookmark(1000L, savedMember.getEmail());
        });

        //Then
        assertEquals("코스를 찾을 수 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("코스 북마크 취소 - 유저가 북마크 버튼을 누른적 없는 경우 에외 처리")
    public void cancelCourseBookmark_not_likes() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("cancelBookmarkNoLike");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();

        //When
        Exception exception = assertThrows(CourseBookmarkNotFoundException.class, () -> {
            courseBookmarkService.cancelBookmark(courseId, savedMember.getEmail());
        });

        //Then
        assertEquals("현재 유저는 해당 코스를 북마크에 담지 않았습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("코스 북마크 존재 확인(true) - 정상 처리")
    public void existsCourseBookmark() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("existsBookmark");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());

        //When
        boolean isExists = courseBookmarkService.isExistCourseBookmark(courseId, savedMember.getEmail());

        //Then
        assertEquals(true, isExists);
    }

    @Test
    @DisplayName("코스 북마크 존재 확인(false) - 정상 처리")
    public void existsCourseBookmark2() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("existsBookmark2");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());
        courseBookmarkService.cancelBookmark(courseId, savedMember.getEmail());

        //When
        boolean isExists = courseBookmarkService.isExistCourseBookmark(courseId, savedMember.getEmail());

        //Then
        assertEquals(false, isExists);
    }

    @Test
    @DisplayName("코스 북마크 존재 확인 - 로그인 하지 않은 경우 예외 처리")
    public void existsCourseBookmark_not_member() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("existsBookmarkNotMem");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());

        //When
        Exception exception = assertThrows(MemberNotFoundException.class, () -> {
            courseBookmarkService.isExistCourseBookmark(courseId, "null@null.com");
        });

        //Then
        assertEquals("회원을 찾을 수 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("코스 북마크 존재 확인 - 코스가 존재하지 않는 경우 예외 처리")
    public void existsCourseBookmark_courseId_null() throws Exception{
        //Given
        CourseReq originReq1 = createCourseReq("바다 구경 코스", List.of(1L, 2L));
        Member savedMember = createMember("existsBookmarkNoId");
        CourseIdRes courseIdRes = courseService.createCourse(originReq1, savedMember.getEmail());

        Long courseId = courseIdRes.getCourseId();
        courseBookmarkService.addBookmark(courseId, savedMember.getEmail());

        //When
        Exception exception = assertThrows(CourseNotFoundException.class, () -> {
            courseBookmarkService.isExistCourseBookmark(1000L, savedMember.getEmail());
        });

        //Then
        assertEquals("코스를 찾을 수 없습니다.", exception.getMessage());
    }

    private CourseReq createCourseReq(String title, List<Long> placeIds) {
        CourseReq myCourseReq = CourseReq.builder()
                .title(title)
                .courseDays("1박2일")
                .isPublished(false)
                .region("서울")
                .thumbnailUrl("images/01.jpg")
                .startDate("2023-03-30")
                .endDate("2023-03-31")
                .content("나의 첫번재 일정 입니다.")
                .placeIds(placeIds)
                .build();
        return myCourseReq;
    }

    private Member createMember(String email) {
        Member member = Member.builder()
                .nickName("nick")
                .name("김모행")
                .email(email + "@test")
                .role(Role.NORMAL)
                .build();
        Member savedMember = memberRepository.save(member);
        return savedMember;
    }

}