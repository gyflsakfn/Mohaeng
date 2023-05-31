import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import styles from "./CourseDetailHead.module.css";
import { useRouter } from "next/router";
import { useRouterQuery } from "@/src/hooks/useRouterQuery";
import {
  getCourseDetailAction,
  removeCourseAction,
} from "@/src/store/thunks/courseThunks";
import { addFormValue } from "@/src/store/reducers/CourseFormSlice";

const CourseDetailHead = () => {
  const [formattedDate, setFormattedDate] = useState(
    getFormattedDate(new Date())
  );
  const courseDetail = useAppSelector((state) => state.courseDetail.course);
  const { courseId, title, profileImgUrl, places, nickname, createdDate } =
    courseDetail;
  const { nickName } = useAppSelector((state) => state.nickName);
  const dispatch = useAppDispatch();
  const id = useRouterQuery("id");
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(getCourseDetailAction(id));
    }
  }, [id]);

  const handleRemoveCourse = () => {
    if (confirm(`${title} 코스를 정말 삭제하시겠습니까?`)) {
      if (id) {
        dispatch(removeCourseAction(id));

        router.push("/course");
      }
    }
  };

  const handleEditCourse = () => {
    const CourseFormValue = {
      title: courseDetail.title,
      content: courseDetail.content,
      courseDays: courseDetail.courseDays,
      startDate: courseDetail.startDate,
      endDate: courseDetail.endDate,
      region: courseDetail.region,
      isPublished: courseDetail.isPublished,
      isBookmarked: courseDetail.isBookmarked,
      isLiked: courseDetail.isLiked,
      places: courseDetail.places,
    };

    dispatch(addFormValue(CourseFormValue));
    router.push({
      pathname: "/course/edit-course",
      query: { courseId: courseId },
    });
  };

  function getFormattedDate(date: Date): string {
    if (isNaN(date.getTime())) return " ";

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  }

  useEffect(() => {
    setFormattedDate(getFormattedDate(new Date(createdDate)));
  }, [createdDate]);

  return (
    <div className={styles["detail-head-container"]}>
      <div className={styles["title-wrapper"]}>
        <div className={styles["course-length"]}>
          {places && `${places.length}코스`}
        </div>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles["detail-head-nav"]}>
        {profileImgUrl && nickname && (
          <div className={styles["user-info"]}>
            <Image
              className={styles["kakao-profile-img"]}
              src={profileImgUrl}
              alt="카카오프로필"
              width={36}
              height={36}
            />
            <p>{nickname}</p>
          </div>
        )}
        <div className={styles["nav-right"]}>
          {formattedDate && (
            <span className={styles["create-date"]}>{formattedDate}</span>
          )}
          {nickName === nickname ? (
            <div className={styles["btn-wrapper"]}>
              <div
                className={`${styles["edit-btn"]} ${styles.btn}`}
                onClick={handleEditCourse}
              >
                수정
              </div>
              <div
                className={`${styles["remove-btn"]} ${styles.btn}`}
                onClick={handleRemoveCourse}
              >
                삭제
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHead;
