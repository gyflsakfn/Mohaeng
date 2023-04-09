import styles from "./CourseList.module.css";

import React, { useEffect, useState } from "react";
import CourseItem from "./CourseItem";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { getCourseListAction } from "@/src/store/reducers/CourseSlice";
import { setPage } from "@/src/store/reducers/pageSlice";
import Pagebar from "../Pagenation/Pagebar";
import ListContainer from "../UI/ListContainer";

const CourseList = () => {
  const { courseList, totalElements, totalPages } = useAppSelector(
    (state) => state.course
  );
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
      {courseList.length > 0 ? (
        <ListContainer>
          {courseList.map((course) => (
            <CourseItem
              key={course.id}
              id={course.id}
              title={course.title}
              content={course.content}
              likeCount={course.likeCount}
              thumbnailUrl={course.thumbnailUrl}
              courseDays={course.courseDays}
              isBookMarked={course.isBookMarked}
              isLiked={course.isLiked}
              places={course.places}
            />
          ))}
        </ListContainer>
      ) : (
        <p>데이터가 존재하지 않습니다. 코스를 등록해주세요.</p>
      )}
      {totalPages !== 0 && totalPages ? (
        <Pagebar totalPage={totalPages} />
      ) : null}
    </>
  );
};

export default CourseList;
