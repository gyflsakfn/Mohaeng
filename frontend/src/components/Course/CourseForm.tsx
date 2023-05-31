import styles from "./CourseForm.module.css";
import React from "react";
import CourseInputForm from "@/src/components/CreateCourse/CourseInputForm";

import CoursePlaceInput from "@/src/components/CreateCourse/CoursePlaceInput";
import CourseFormButton from "./CourseFormButton";
import CourseSelectedInfo from "./CourseSelectedInfo";

export interface CourseFormProps {
  isEditMode: boolean;
}

const CourseForm = ({ isEditMode }: CourseFormProps) => {
  return (
    <>
      <div className={styles["input-container"]}>
        <CourseInputForm />
        <CoursePlaceInput />
      </div>
      <CourseSelectedInfo />
      <CourseFormButton isEditMode={isEditMode} />
    </>
  );
};

export default React.memo(CourseForm);
