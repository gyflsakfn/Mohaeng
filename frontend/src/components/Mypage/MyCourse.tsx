import styles from "./MyCourse.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import MyCourseItem from "./MyCourseItem";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { useEffect } from "react";
import { getMyCourse } from "@/src/store/reducers/myCourseSlice";
import cookie from "react-cookies";

const MyCourse = () => {
  const appDispatch = useAppDispatch();
  const accessToken = cookie.load("accessToken");
  const myCourse = useSelector((state: RootState) => state.myCourse.data);

  useEffect(() => {
    appDispatch(getMyCourse(accessToken));
  }, []);

  return (
    <>
      <div className={styles.tabContainer}></div>
      <div className={styles["bookmark-container"]}>
        {myCourse.map((course) => (
          <MyCourseItem
            courseId={course.courseId}
            imgUrl={course.imgUrl}
            title={course.title}
            likeCount={course.likeCount}
            createdDate={course.createdDate}
            content={course.content}
            courseDays={course.courseDays}
            courseStatus={course.courseStatus}
          />
        ))}
      </div>
    </>
  );
};

export default MyCourse;
