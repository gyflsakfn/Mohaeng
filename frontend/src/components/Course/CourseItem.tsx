import { CourseListProps } from "@/src/interfaces/Course";
import styles from "./CourseItem.module.css";
import React, { useState } from "react";
import Image from "next/image";

import {
  BsBookmark,
  BsBookmarkFill,
  BsMapFill,
  BsMap,
  BsShare,
} from "react-icons/bs";

import RoughMap from "./RoughMap";

import TagItem from "../UI/TagItem";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import {
  bookmarkToggleAction,
  likeToggleAction,
} from "@/src/store/thunks/courseThunks";
import { useRouter } from "next/router";
import IsLikeState from "../UI/IsLikeState";
import { openModal } from "@/src/store/reducers/modalSlice";
import { kakaoShare } from "@/src/utils/kakao-share";
import { resetCourseDetail } from "@/src/store/reducers/CourseDetailSlice";

declare global {
  interface Window {
    Kakao: any;
  }
}

const CourseItem = ({
  courseId,
  title,
  content,
  likeCount,
  courseDays,
  thumbnailUrl,
  isBookmarked,
  isLiked,
  places,
}: CourseListProps) => {
  const [isRoughMapOpen, setIsRoughMapOpen] = useState(false);
  const [isBookmarkHandlerRunning, setIsBookmarkHandlerRunning] =
    useState(false);
  const [isLikeHandlerRunning, setIsLikeHandlerRunning] = useState(false);

  const { id: userId } = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const toggleRoughMapHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setIsRoughMapOpen((prev) => !prev);
  };

  const onClose = () => {
    setIsRoughMapOpen(false);
  };

  const handleToggleBookmark = () => {
    if (isBookmarkHandlerRunning) {
      return; // 핸들러가 실행 중이면 새로운 이벤트 발생하지 않음
    }
    setIsBookmarkHandlerRunning(true);
    if (userId) {
      dispatch(
        bookmarkToggleAction({
          courseId,
          isBookmarked,
          isDetailPage: false,
        })
      ).then(() => {
        setIsBookmarkHandlerRunning(false);
      });
    } else {
      dispatch(
        openModal({
          modalType: "LoginModal",
          isOpen: true,
        })
      );
      setIsBookmarkHandlerRunning(false);
    }
  };

  const handleToggleLike = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (isLikeHandlerRunning) {
      return; // 이벤트 핸들러가 실행 중인 경우 함수 실행하지 않음
    }
    setIsLikeHandlerRunning(true);

    if (userId) {
      dispatch(
        likeToggleAction({ courseId, isLiked, isDetailPage: false })
      ).then(() => {
        setIsLikeHandlerRunning(false);
      });
    } else {
      dispatch(
        openModal({
          modalType: "LoginModal",
          isOpen: true,
        })
      );
      setIsLikeHandlerRunning(false);
    }
  };

  const handleLinkClick = () => {
    dispatch(resetCourseDetail());
    router.push(`/course/${courseId}`, undefined, { shallow: true });
  };

  const handleKakaoShare = () => {
    if (userId) {
      const param = {
        title,
        content,
        thumbnailUrl,
        likeCount,
        courseId,
      };
      kakaoShare(param);
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
    <div className={styles["course-item-container"]}>
      <div className={styles["item-info-container"]} onClick={handleLinkClick}>
        <div className={styles["item-image"]}>
          <div className={styles["item-image-box"]}></div>
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              width={700}
              height={700}
              priority
            />
          ) : (
            <div>이미지 준비 중</div>
          )}
          <IsLikeState
            onClick={handleToggleLike}
            likeCount={likeCount}
            isLiked={isLiked}
          />
        </div>
        <div className={styles["item-info-text"]}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.content}>{content}</p>
          {courseDays && <TagItem size="S" text={courseDays} />}
        </div>
      </div>
      <div className={styles["item-nav-container"]}>
        <div className={styles["item-nav"]} onClick={handleToggleBookmark}>
          {isBookmarked ? (
            <BsBookmarkFill className={`${styles.bookmark} ${styles.icon}`} />
          ) : (
            <BsBookmark className={`${styles.unbookmark} ${styles.icon}`} />
          )}
        </div>
        <div
          className={`${styles["item-nav"]} ${styles.center}`}
          onClick={handleKakaoShare}
        >
          <BsShare className={styles.icon} />
        </div>
        <div
          className={`${styles["item-nav"]} ${styles.roughmapBtn}`}
          onClick={toggleRoughMapHandler}
        >
          {isRoughMapOpen ? (
            <BsMapFill className={styles.icon} color="var(--color-blue)" />
          ) : (
            <BsMap className={styles.icon} />
          )}
          {isRoughMapOpen && (
            <RoughMap RoughMapData={places} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CourseItem);
