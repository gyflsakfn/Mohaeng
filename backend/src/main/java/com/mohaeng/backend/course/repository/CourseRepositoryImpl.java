package com.mohaeng.backend.course.repository;

import com.mohaeng.backend.course.domain.*;
import com.mohaeng.backend.course.dto.CourseListDto;
import com.mohaeng.backend.course.dto.CourseSearchDto;
import com.mohaeng.backend.course.dto.MainCourseListDto;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.Wildcard;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.ArrayList;
import java.util.List;

import static com.mohaeng.backend.course.domain.QCourse.course;
import static com.mohaeng.backend.course.domain.QCourseBookmark.courseBookmark;
import static com.mohaeng.backend.course.domain.QCourseLikes.courseLikes;
import static com.mohaeng.backend.course.domain.QCoursePlace.coursePlace;
import static java.util.Objects.isNull;
import static org.springframework.util.ObjectUtils.isEmpty;

public class CourseRepositoryImpl implements CourseRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    public CourseRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Page<CourseListDto> findAllCourseWithBookmarkAndLikes(CourseSearchDto courseSearchDto, Pageable pageable, Long memberId) {
        OrderSpecifier[] orderSpecifiers = createOrderSpecifier(courseSearchDto.getSort());

        List<CourseListDto> results = queryFactory
                .select(Projections.constructor(CourseListDto.class,
                        course.id,
                        course.title,
                        course.content,
                        course.courseDays,
                        course.likeCount,
                        course.thumbnailUrl,
                        courseBookmark.course.id.isNull().not(),
                        courseLikes.course.id.isNull().not(),
                        Expressions.stringTemplate("group_concat({0})",coursePlace.place.name).as("places")
                        ))
                .from(course)
                .leftJoin(coursePlace)
                .on(course.id.eq(coursePlace.course.id)
                        .and(coursePlace.deletedDate.isNull()))
                .leftJoin(courseBookmark)
                .on(course.id.eq(courseBookmark.course.id)
                        .and(courseBookmark.member.id.eq(memberId))
                        .and(courseBookmark.deletedDate.isNull()))
                .leftJoin(courseLikes)
                .on(course.id.eq(courseLikes.course.id)
                        .and(courseLikes.member.id.eq(memberId))
                        .and(courseLikes.deletedDate.isNull()))
                .where(
                        titleEq(courseSearchDto.getKeyword()),
                        regionEq(courseSearchDto.getRegion()),
                        course.courseStatus.eq(CourseStatus.PUBLIC)
                )
                .groupBy(course.id)
                .orderBy(orderSpecifiers)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> totalCount = queryFactory
                .select(Wildcard.count)
                .from(course)
                .where(
                        titleEq(courseSearchDto.getKeyword()),
                        regionEq(courseSearchDto.getRegion()),
                        course.courseStatus.eq(CourseStatus.PUBLIC)
                );

        return PageableExecutionUtils.getPage(results, pageable, totalCount::fetchOne);
    }

    @Override
    public List<MainCourseListDto> findTop10Course(Long memberId) {
        List<MainCourseListDto> results = queryFactory
                .select(Projections.constructor(MainCourseListDto.class,
                        course.id,
                        course.title,
                        course.thumbnailUrl,
                        course.likeCount,
                        course.content,
                        course.region,
                        course.courseDays,
                        courseBookmark.course.id.isNull().not(),
                        courseLikes.course.id.isNull().not()
                ))
                .from(course)
                .leftJoin(courseBookmark)
                .on(course.id.eq(courseBookmark.course.id)
                        .and(courseBookmark.member.id.eq(memberId))
                        .and(courseBookmark.deletedDate.isNull()))
                .leftJoin(courseLikes)
                .on(course.id.eq(courseLikes.course.id)
                        .and(courseLikes.member.id.eq(memberId))
                        .and(courseLikes.deletedDate.isNull()))
                .where(
                        course.courseStatus.eq(CourseStatus.PUBLIC)
                )
                .groupBy(course.id)
                .orderBy(course.likeCount.desc(), course.id.desc())
                .limit(10)
                .fetch();
        return results;
    }

    private OrderSpecifier[] createOrderSpecifier(String sortCondition) {

        List<OrderSpecifier> orderSpecifiers = new ArrayList<>();

        if(isNull(sortCondition) || sortCondition.equals("courseId")){
            orderSpecifiers.add(new OrderSpecifier(Order.DESC, course.id));
        } else {
            orderSpecifiers.add(new OrderSpecifier(Order.DESC, course.likeCount));
            orderSpecifiers.add(new OrderSpecifier(Order.DESC, course.id));
        }
        return orderSpecifiers.toArray(new OrderSpecifier[orderSpecifiers.size()]);
    }
    private BooleanExpression titleEq(String keyword) {
        return isNull(keyword) ? null : course.title.contains(keyword);
    }

    private BooleanExpression placeEq(String keyword) {
        return isNull(keyword) ? null : coursePlace.place.name.contains(keyword);
    }

    private BooleanExpression regionEq(String region) {
        return isEmpty(region) ? null : course.region.eq(region);
    }

}
