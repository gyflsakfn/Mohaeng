import Button from "@/src/components/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import React from "react";
import styles from "./UserInfo.module.css";
import { setCurrIdx, myPageState } from "@/src/store/reducers/mypageSlice";
import { openModal } from "@/src/store/reducers/modalSlice";
import Image from "next/image";

const UserInfo = () => {
  const dispatch = useDispatch();

  const id = useSelector((state: RootState) => state.id.id);
  const nickName = useSelector((state: RootState) => state.nickName.nickName);
  const email = useSelector((state: RootState) => state.email.email);
  const profileUrl = useSelector((state: RootState) => state.imgUrl.imgUrl);

  const editUser: myPageState = {
    currIdx: 4,
    label: "회원 정보 수정",
  };

  const handleOpenDeleteModal = () => {
    dispatch(
      openModal({
        modalType: "DeleteMemberModal",
        isOpen: true,
      })
    );
  };

  return (
    <div className={styles["Container"]}>
      <div className={styles["ProfileWrapper"]}>
        <Image
          src={profileUrl}
          className={styles["Avatar"]}
          alt="카카오프로필"
          width={140}
          height={140}
        />
        <div>
          {/* <div className={styles["Name"]}>{id}</div> */}
          <div className={styles["Nickname"]}>{nickName}</div>
          <div className={styles["Email"]}>{email}</div>
        </div>
      </div>
      <div className={styles["ButtonWrapper"]}>
        <Button
          type="click"
          text="정보수정"
          onClick={() => dispatch(setCurrIdx(editUser))}
        />

        <Button
          type="click"
          text="회원탈퇴"
          onClick={() => handleOpenDeleteModal()}
        />
      </div>
    </div>
  );
};

export default UserInfo;
