"use client";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import UserInfo from "@/src/components/Mypage/UserInfo";
import UserEdit from "@/src/components/Mypage/UserEdit";
import UserBookmark from "@/src/components/Mypage/UserBookmark";
import Sidebar from "@/src/components/Mypage/Sidebar";
import { useRouter } from "next/router";
import cookie from "react-cookies";
import withAuth from "../withAuth";
import MyCourse from "@/src/components/Mypage/MyCourse";
import MyReview from "@/src/components/Mypage/MyReview";

const MyPage: React.FC = () => {
  const currIdx = useSelector((state: RootState) => state.mypage.currIdx);
  const label = useSelector((state: RootState) => state.mypage.label);
  const accessToken = cookie.load("accessToken");

  const router = useRouter();

  //TODO: 로그인 페이지 완성시 경로 '/login'으로 바꿔두기
  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken]);

  return (
    <div className={styles.Container}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <h2 className={styles["Title"]}>{label}</h2>
        <div className={styles.itemWrapper}>
          {
            {
              0: <UserInfo />,
              1: <UserBookmark />,
              2: <MyCourse />,
              3: <MyReview />,
              4: <UserEdit />,
            }[currIdx]
          }
        </div>
      </div>
    </div>
  );
};

// export default withAuth(MyPage);
export default MyPage;
