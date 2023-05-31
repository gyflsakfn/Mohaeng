import Image from "next/image";
import React, { useState } from "react";
import styles from "./HeaderSideMenu.module.css";
import { GrClose } from "react-icons/gr";
import UserProfile from "./UserProfile";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import HeaderNav from "./HeaderNav";
import cookie from "react-cookies";
import { useRouter } from "next/router";

import { MdLogout } from "react-icons/md";

import { closeModal } from "@/src/store/reducers/modalSlice";
import { resetFilter } from "@/src/store/reducers/FilterSlice";
import { getCourseBookmark } from "@/src/store/reducers/CourseBoomarkSlice";
import { getPlaceBookmark } from "@/src/store/reducers/PlaceBookmarkSlice";
import { getMyCourse } from "@/src/store/reducers/myCourseSlice";
import { getMyReview } from "@/src/store/reducers/myReviewSlice";
import { myPageState, setCurrIdx } from "@/src/store/reducers/mypageSlice";
import { resetLog } from "@/src/store/reducers/loginTokenSlice";

import { RiKakaoTalkFill } from "react-icons/ri";
import { KAKAO_AUTH_URL } from "@/src/pages/api/auth/OAuth";

const HeaderSideMenu = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const id = useAppSelector((state) => state.nickName.id);
  const imgUrl = useAppSelector((state) => state.imgUrl.imgUrl);
  const nickName = useAppSelector((state) => state.nickName.nickName);
  const accessToken = cookie.load("accessToken");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleClickMY = () => {
    router.push("/mypage");
    dispatch(resetFilter());
    dispatch(getCourseBookmark(accessToken));
    dispatch(getPlaceBookmark(accessToken));
    dispatch(getMyCourse(accessToken));
    dispatch(getMyReview(accessToken));
    const currComponent: myPageState = {
      currIdx: 0,
      label: "회원정보",
    };

    dispatch(setCurrIdx(currComponent));
  };
  const handleLogout = () => {
    cookie.remove("accessToken", { path: "/" });
    dispatch(resetLog());
    router.replace("/");
  };

  const handleLogin = () => {
    router.push(KAKAO_AUTH_URL);
  };

  return (
    <div className={`${styles.mobileMenu}`}>
      <div className={styles["menu-top"]}>
        <div className={styles["logo-wrapper"]}>
          <Image
            src={"/assets/logo_desktop.png"}
            alt="logo"
            width={256}
            height={59}
            className={styles.logo}
          />
        </div>
        <GrClose
          className={styles["close-icon"]}
          onClick={() => dispatch(closeModal())}
        />
      </div>
      {id && (
        <div className={styles["user-wrapper"]}>
          <UserProfile url={imgUrl} nickName={nickName} />
          <button className={styles["my-btn"]} onClick={handleClickMY}>
            MY
          </button>
        </div>
      )}
      {!id && (
        <div className={styles["login-wrapper"]}>
          <button className={styles.kakaoBtn} onClick={handleLogin}>
            <RiKakaoTalkFill size={22} />
            카카오 로그인
          </button>
        </div>
      )}
      <HeaderNav activeLink={activeLink} setActiveLink={setActiveLink} />
      {id && (
        <div className={styles["logout-wrapper"]}>
          <div className={styles["logout-btn"]} onClick={handleLogout}>
            <MdLogout className={styles.logout} />
            로그아웃
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSideMenu;
