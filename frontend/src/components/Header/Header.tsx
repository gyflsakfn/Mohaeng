import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import axios from "axios";
import cookie from "react-cookies";

import { useSelector } from "react-redux";
import { openModal } from "../../store/reducers/modalSlice";
import {
  setEmail,
  setId,
  setNickname,
  setImgUrl,
} from "@/src/store/reducers/loginTokenSlice";
import { RootState } from "@/src/store/store";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";

import { FiMenu } from "react-icons/fi";
import { MdOutlineArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";

import SearchBar from "./SearchBar";
import HeaderNav from "./HeaderNav";
import UserProfile from "./UserProfile";
import HeaderLogo from "./HeaderLogo";
import Dropdown from "../Mypage/Dropdown";
import useDeleteToken from "@/src/hooks/useDeleteToken";
function Header() {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [view, setView] = useState(false);

  const dispatch = useAppDispatch();

  const id = useAppSelector((state) => state.nickName.nickName);
  const imgUrl = useAppSelector((state) => state.imgUrl.imgUrl);
  const nickName = useAppSelector((state) => state.nickName.nickName);

  // 24시간 후 액세스토큰 자동 삭제
  useDeleteToken();

  // * 로그인 정보 조회
  useEffect(() => {
    const response = async () => {
      const accessToken = await cookie.load("accessToken");
      if (accessToken) {
        const userRes = await axios.get(`/loginInfo`, {
          headers: {
            "Access-Token": accessToken,
          },
          withCredentials: true,
        });
        const { id, nickName, email, imgUrl } = userRes.data.data;
        dispatch(setId(id));
        dispatch(setEmail(email));
        dispatch(setNickname(nickName));
        dispatch(setImgUrl(imgUrl));
      }
    };
    response();
  }, []);

  // * 로그인 모달
  const handleOpenLoginModal = () => {
    dispatch(
      openModal({
        modalType: "LoginModal",
        isOpen: true,
      })
    );
  };

  const handleOpenMenuModal = () => {
    dispatch(
      openModal({
        modalType: "HeaderSideMenu",
        isOpen: true,
        opacity: 0.3,
        translateX: 100,
      })
    );
  };

  const handleProfileClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setView((prev) => !prev);
  };

  const handleDropDownClose = () => {
    setView(false);
  };
  return (
    <header className={styles.header}>
      <div className={styles["header-container"]}>
        <HeaderLogo setActiveLink={setActiveLink} />
        <SearchBar />
        <div className={styles["desktop-only"]}>
          <HeaderNav activeLink={activeLink} setActiveLink={setActiveLink} />
          {id ? (
            <>
              <div
                className={styles["profile-wrapper"]}
                onClick={handleProfileClick}
              >
                <UserProfile url={imgUrl} nickName={nickName} />
                {view ? <MdOutlineArrowDropUp /> : <MdOutlineArrowDropDown />}
                {view && <Dropdown onClose={handleDropDownClose} />}
              </div>
            </>
          ) : (
            <>
              <button
                className={styles["login-btn"]}
                onClick={handleOpenLoginModal}
              >
                로그인
              </button>
            </>
          )}
        </div>

        <div
          className={`${styles["mobile-only"]} ${styles.menu}`}
          onClick={handleOpenMenuModal}
        >
          <FiMenu />
        </div>
      </div>
    </header>
  );
}

export default React.memo(Header);
