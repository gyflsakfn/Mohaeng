import { useAppSelector } from "@/src/hooks/useReduxHooks";
import { initialState } from "@/src/store/reducers/CourseFormSlice";

import KakaoMap from "@/src/components/KakaoMap/KakaoMap";
import CourseOrderList from "@/src/components/CourseDetail/CourseOrderList";
import React from "react";

import styles from "./CourseSelectedInfo.module.css";

const CourseSelectedInfo = () => {
  const { places } = useAppSelector(
    (state) => state.courseForm.course ?? initialState,
    (prev, next) => {
      // equalityFn으로 이전 값과 새 값을 비교하여 변경이 없으면 true를 반환
      return prev.places === next.places;
    }
  );
  return (
    <>
      {places?.length > 0 && (
        <div className={styles.info}>
          <KakaoMap mapData={places} />
          <CourseOrderList places={places} mode={"write"} />
        </div>
      )}
    </>
  );
};

export default CourseSelectedInfo;
