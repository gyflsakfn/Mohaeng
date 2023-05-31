import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { resetFilter } from "@/src/store/reducers/FilterSlice";
import { myPageState, setCurrIdx } from "@/src/store/reducers/mypageSlice";
import { getCourseListAction } from "@/src/store/thunks/courseThunks";
import Link from "next/link";
import React, { useEffect } from "react";
import styles from "./HeaderNav.module.css";

const HeaderNav = ({ activeLink, setActiveLink }: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 로컬 스토리지에서 값을 가져와서 activeLink 상태를 초기화합니다.
    const storedActiveLink = localStorage.getItem("activeLink");
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }
  }, []);

  useEffect(() => {
    // activeLink 상태가 변경될 때마다 로컬 스토리지에 값을 저장합니다.
    if (activeLink) {
      localStorage.setItem("activeLink", activeLink);
    } else {
      localStorage.setItem("activeLink", "home");
    }
  }, [activeLink]);

  const handleClickPlace = () => {
    setActiveLink("place");
    dispatch(resetFilter());

    const currComponent: myPageState = {
      currIdx: 0,
      label: "회원정보",
    };

    dispatch(setCurrIdx(currComponent));
  };
  const handleClickCourse = () => {
    setActiveLink("course");
    dispatch(resetFilter());
    const currComponent: myPageState = {
      currIdx: 0,
      label: "회원정보",
    };
    dispatch(setCurrIdx(currComponent));
    dispatch(getCourseListAction({}));
  };
  return (
    <div className={styles.nav}>
      <Link
        href="/place"
        onClick={handleClickPlace}
        className={`${styles.link} ${
          activeLink === "place" ? styles.active : ""
        }`}
      >
        여행지
      </Link>
      <Link
        href="/course"
        onClick={handleClickCourse}
        className={`${styles.link} ${
          activeLink === "course" ? styles.active : ""
        }`}
      >
        코스
      </Link>
    </div>
  );
};

export default HeaderNav;
