"use client";
import Link from "next/link";
import styles from "./MyCourseItem.module.css";
import cookie from "react-cookies";
import axios from "axios";
import { getMyCourse } from "@/src/store/reducers/myCourseSlice";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { useEffect } from "react";

export interface MyCourseItemProps {
  courseId: number;
  imgUrl: string;
  title: string;
  likeCount: number;
  createdDate: string;
  content: string;
  courseDays: string;
  courseStatus: string;
}

const MyCourseItem = (myCourse: MyCourseItemProps) => {
  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };
  const accessToken = cookie.load("accessToken");
  const appDispatch = useAppDispatch();

  const clickToggle = () => {
    var ispublish: boolean = true;

    if (myCourse.courseStatus === "PUBLIC") {
      ispublish = false;
    } else {
      ispublish = true;
    }

    const response = async () => {
      if (accessToken) {
        await axios.put(
          `/api/myPage/course/visibility/${myCourse.courseId}`,
          { isPublished: ispublish },
          {
            headers: {
              "Access-Token": accessToken,
            },
          }
        );
      }
    };

    response().then(() => {
      appDispatch(getMyCourse(accessToken));
    });
  };

  return (
    <div key={myCourse.courseId} className={styles["myCourse-item"]}>
      <Link
        href={{
          pathname: "/course/[id]",
          query: { id: myCourse.courseId },
        }}
      >
        <img
          src={myCourse.imgUrl}
          className={styles.img}
          alt={myCourse.title}
        />
      </Link>
      <div className={styles.courseItemInfo}>
        <button className={styles.publicButton} onClick={clickToggle}>
          {myCourse.courseStatus === "PUBLIC" ? (
            <p className={styles.public}>공개</p>
          ) : (
            <p className={styles.private}>비공개</p>
          )}
        </button>
        <h2>{myCourse.title}</h2>
        <p>{getFormattedDate(new Date(myCourse.createdDate))}</p>
        <p>{myCourse.content}</p>
        <p className={styles.liked}>
          ❤<p className={styles.likedCount}>{myCourse.likeCount}</p>
        </p>
      </div>
    </div>
  );
};

export default MyCourseItem;
