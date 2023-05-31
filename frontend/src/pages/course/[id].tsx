import styles from "./courseDetail.module.css";

import CourseDetailNav from "@/src/components/CourseDetail/CourseDetailNav";
import CourseDetailContent from "@/src/components/CourseDetail/CourseDetailContent";
import CourseDetailHead from "@/src/components/CourseDetail/CourseDetailHead";
import React from "react";

function CourseDetail() {
  return (
    <>
      <main className={styles["course-id-container"]}>
        <CourseDetailHead />
        <CourseDetailNav />
        <CourseDetailContent />
      </main>
    </>
  );
}

export default React.memo(CourseDetail);
