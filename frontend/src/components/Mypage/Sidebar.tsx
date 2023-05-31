import Link from "next/link";
import styles from "./Sidebar.module.css";
import { User } from "@/src/interfaces/Auth";
import React, { useEffect, useState } from "react";
import { RootState } from "@/src/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrIdx, myPageState } from "@/src/store/reducers/mypageSlice";
import UserInfo from "./UserInfo";

const SidebarLink = ({ currIdx, label }: myPageState) => {
  const dispatch = useDispatch();
  const currComponent: myPageState = {
    currIdx: currIdx,
    label: label,
  };
  return (
    <li className={styles["sidebar-list"]}>
      <button
        className={styles["sidebar-button"]}
        onClick={() => dispatch(setCurrIdx(currComponent))}
      >
        {label}
      </button>
    </li>
  );
};

const Sidebar = () => {
  const nickName = useSelector((state: RootState) => state.nickName.nickName);
  const imageUrl = useSelector((state: RootState) => state.imgUrl.imgUrl);

  const links: myPageState[] = [
    { currIdx: 0, label: "회원정보" },
    { currIdx: 1, label: "즐겨찾기" },
    { currIdx: 2, label: "나의 여행 일정" },
    { currIdx: 3, label: "나의 리뷰" },
  ];

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.sidebarLists}>
        <div className={styles.profileWrapper}>
          <div className={styles.avatarBox}>
            <img src={imageUrl} className={styles.avatar} />
          </div>
          <div>
            <div className={styles.nickName}>{nickName}</div>
          </div>
        </div>
        {links.map((link) => (
          <SidebarLink
            key={link.currIdx}
            currIdx={link.currIdx}
            label={link.label}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
