import React from "react";
import styles from "./CourseListOptions.module.css";

import { BiPencil } from "react-icons/bi";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { openModal } from "@/src/store/reducers/modalSlice";

import SelectSorting from "@/src/components/Course/SelectSorting";
import SearchKeyword from "@/src/components/Course/SearchKeyword";

const CourseListOptions = () => {
  const router = useRouter();
  const { id: userId } = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();
  const handleCreateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userId) {
      router.push("course/create-course");
    } else {
      dispatch(
        openModal({
          modalType: "LoginModal",
          isOpen: true,
        })
      );
    }
  };
  return (
    <>
      <div className={styles["course-options-container"]}>
        <div className={styles["filter-wrapper"]}>
          <SelectSorting />
          <SearchKeyword />
        </div>
        <button className={styles["write-btn"]} onClick={handleCreateClick}>
          코스 작성
        </button>
      </div>
    </>
  );
};

export default CourseListOptions;
