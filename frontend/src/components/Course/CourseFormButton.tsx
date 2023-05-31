import React from "react";
import { useRouter } from "next/router";
import { resetFilter } from "@/src/store/reducers/FilterSlice";
import { useRouterQuery } from "@/src/hooks/useRouterQuery";
import {
  createCourseAction,
  editCourseAction,
} from "@/src/store/thunks/courseThunks";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import {
  initialState,
  resetFormValue,
} from "@/src/store/reducers/CourseFormSlice";
import { CourseFormProps } from "./CourseForm";

import styles from "./CourseFormButton.module.css";
import { resetCourseDetail } from "@/src/store/reducers/CourseDetailSlice";

const CourseFormButton = ({ isEditMode }: CourseFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { course, isFormValid } = useAppSelector(
    (state) => state.courseForm ?? initialState
  );
  const id = useRouterQuery("courseId");

  const createCourse = async () => {
    await dispatch(createCourseAction(course));
    await router.push(`/course`);
  };

  const editCourse = async () => {
    if (!id) {
      console.error("Invalid id value");
      return;
    }

    await dispatch(editCourseAction({ formData: course, courseId: id }));
    dispatch(resetCourseDetail());
    await router.push(`/course/${id}`);
  };

  /** 코스 생성 또는 수정 후 목록 페이지로 이동 */
  const handleCourseFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return window.alert("양식을 다시 확인해주세요.");
    if (!isEditMode) {
      await createCourse();
    } else {
      await editCourse();
    }
    dispatch(resetFormValue());
    dispatch(resetFilter());
  };

  const handleCourseCancel = () => {
    dispatch(resetFormValue());
    // as를 전달하여 페이지가 새로 고쳐지고 데이터가 업데이트 됨.
    router.push("/course", "/course");
  };

  return (
    <div className={styles["button-wrapper"]}>
      <button
        className={`${styles["cancel-btn"]} ${styles.btn}`}
        onClick={handleCourseCancel}
      >
        취소
      </button>
      <button
        className={`${styles["submit-btn"]} ${styles.btn}`}
        onClick={handleCourseFormSubmission}
      >
        {isEditMode ? "수정하기" : "작성하기"}
      </button>
    </div>
  );
};

export default CourseFormButton;
