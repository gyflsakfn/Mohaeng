import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { likeToggleAction } from "@/src/store/thunks/courseThunks";
import { openModal } from "@/src/store/reducers/modalSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import IsLikeState from "../UI/IsLikeState";
import styles from "./CourseCard.module.css";
import TagItem from "../UI/TagItem";
import { FaMapMarkerAlt } from "react-icons/fa";
import React from "react";
import { IRecommandCourseProps } from "@/src/interfaces/Course.type";

const CourseCard = ({
  courseId,
  title,
  region,
  courseDays,
  content,
  thumbnailUrl,
  likeCount,
  isLiked,
  onUpdateCourse,
}: IRecommandCourseProps) => {
  const handleToggleLike = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (userId) {
      dispatch(likeToggleAction({ courseId, isLiked }));
      onUpdateCourse({
        courseId,
        title,
        content,
        thumbnailUrl,
        isLiked: !isLiked,
        region,
        courseDays,
        likeCount: isLiked ? likeCount - 1 : likeCount + 1,
      });
    } else {
      dispatch(
        openModal({
          modalType: "LoginModal",
          isOpen: true,
        })
      );
    }
  };

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.token);
  const handleCourseCard = () => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className={styles["course-card-container"]} onClick={handleCourseCard}>
      <div className={styles["course-image-container"]}>
        <div className={styles["card-tag"]}>
          {region && (
            <TagItem
              color="MMint"
              size="SS"
              text={region}
              bgColor="white"
              isBorder={true}
              icon={<FaMapMarkerAlt />}
            />
          )}
          {courseDays && (
            <TagItem
              color="Dpink"
              size="SS"
              text={courseDays}
              isBorder={true}
              bgColor="white"
            />
          )}
        </div>

        <Image
          src={thumbnailUrl}
          alt={title}
          width={320}
          height={320}
          priority
        />
        <IsLikeState
          likeCount={likeCount}
          isLiked={isLiked}
          onClick={handleToggleLike}
        />
      </div>
      <div className={styles["course-card-content"]}>
        <h3 className={styles["card-title"]}>{title}</h3>
        <p className={styles["card-desc"]}>{content}</p>
      </div>
    </div>
  );
};

export default CourseCard;
