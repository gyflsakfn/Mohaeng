import { RootState } from "@/src/store/store";
import React from "react";
import { useSelector } from "react-redux";
import KakaoMap from "../KakaoMap/KakaoMap";

import styles from "./CourseDetailContent.module.css";
import CourseOrderList from "./CourseOrderList";

const CourseDetailContent = () => {
  const courseDetail = useSelector(
    (state: RootState) => state.courseDetail.course
  );
  const { content, places } = courseDetail;
  return (
    <div className={styles["content-container"]}>
      <div className={styles.content}>
        {content?.split("\n").map((line, index) => {
          return (
            <div key={index}>
              {line}
              <br />
            </div>
          );
        })}
      </div>

      {/* <p className={styles.content}>{formattedData}</p> */}
      <div className={styles.info}>
        {places && places.length > 0 && <KakaoMap mapData={places} />}
        {places && places.length > 0 && <CourseOrderList places={places} />}
      </div>
    </div>
  );
};

export default CourseDetailContent;
