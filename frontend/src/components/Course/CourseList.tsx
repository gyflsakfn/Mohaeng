import styles from "./CourseList.module.css";

import React, { useEffect, useState } from "react";
import CourseItem from "./CourseItem";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { setPage } from "@/src/store/reducers/pageSlice";
import Pagebar from "../Pagenation/Pagebar";
import ListContainer from "../UI/ListContainer";
import { getCourseListAction } from "@/src/store/thunks/courseThunks";

const CourseList = () => {
  const { courseList, totalPages } = useAppSelector((state) => state.course);
  const { area, keyword, sort } = useAppSelector((state) => state.filter);
  const page = useAppSelector((state) => state.page.page);
  const dispatch = useAppDispatch();
  const { region } = area;

  useEffect(() => {
    dispatch(setPage(page));
    dispatch(
      getCourseListAction({
        ...(region !== "전체보기" ? { region } : {}),
        page,
        ...(keyword ? { keyword } : {}),
        ...(sort ? { sort } : {}),
      })
    );
  }, [dispatch, region, page, keyword, sort]);

  return (
    <>
      {courseList?.length > 0 ? (
        <ListContainer>
          {courseList.map((course) => (
            <CourseItem
              key={course.courseId}
              courseId={course.courseId}
              title={course.title}
              content={course.content}
              likeCount={course.likeCount}
              thumbnailUrl={course.thumbnailUrl}
              courseDays={course.courseDays}
              isBookmarked={course.isBookmarked}
              isLiked={course.isLiked}
              places={course.places}
            />
          ))}
        </ListContainer>
      ) : (
        <p>
          등록된 코스가 없습니다. 자신만의 여행 코스를 작성하여 공유해 보세요!
        </p>
      )}

      {totalPages !== 0 && totalPages ? (
        <Pagebar totalPage={totalPages} />
      ) : null}
    </>
  );
};

export default React.memo(CourseList);
