import React from "react";
import styled from "styled-components";
import styles from "./DeleteMemberModal.module.css";
import Button from "@/src/components/Button/Button";
import { closeModal } from "@/src/store/reducers/modalSlice";
import { useDispatch } from "react-redux";
import {
  setToken,
  setNickname,
  setEmail,
  setId,
} from "@/src/store/reducers/loginTokenSlice";
import cookie from "react-cookies";
import axios from "axios";
import { useRouter } from "next/router";

export default function DeleteMemberModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = cookie.load("accessToken");

  const handleModalClose = () => {
    dispatch(closeModal());
  };

  const deleteUser = () => {
    const response = async () => {
      if (accessToken) {
        const userRes = await axios.delete(`api/user/drop`, {
          headers: {
            "Access-Token": accessToken,
          },
          withCredentials: true,
        });
      }
    };
    response().then(() => {
      cookie.remove("accessToken", { path: "/" });
      dispatch(setToken(""));
      dispatch(setNickname(""));
      dispatch(setEmail(""));
      dispatch(setId(0));
    });
    handleModalClose();
    router.replace("/");
  };

  return (
    <>
      <div className={styles["ContentWrapper"]}>
        <h2 className={styles["h2"]}>회원 탈퇴</h2>
        <div className={styles["TextWrapper"]}>
          <p className={styles["text"]}>
            정말 <strong>탈퇴</strong>하시겠어요? <br />
            탈퇴 시
            <strong>
              {" "}
              회원님이 작성하신 여행 일정과 북마크해둔 장소들이 영구 삭제
            </strong>{" "}
            됩니다! 🥺
          </p>
        </div>
        <div className={styles["ButtonWrapper"]}>
          <Button type="click" text="회원탈퇴" onClick={() => deleteUser()} />
          <Button type="click" text="취소" onClick={() => handleModalClose()} />
        </div>
      </div>
    </>
  );
}
