import styles from "./index.module.css";
import CourseList from "@/src/components/Course/CourseList";
import AreaSelector from "@/src/components/Filter/AreaSelector";
import CourseListOptions from "@/src/components/Course/CourseListOptions";

export default function Course() {
  return (
    <main className={styles.main}>
      <h1>코스</h1>
      <div className={styles["area-wrapper"]}>
        <AreaSelector />
      </div>
      <CourseListOptions />
      <CourseList />
    </main>
  );
}
