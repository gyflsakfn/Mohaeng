import Button from "@/src/components/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import React, { useEffect, useState, useRef } from "react";
import styles from "./UserEdit.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { myPageState, setCurrIdx } from "@/src/store/reducers/mypageSlice";
import cookie from "react-cookies";
import Image from "next/image";
import {
  setEmail,
  setId,
  setNickname,
  setImgUrl,
} from "@/src/store/reducers/loginTokenSlice";

interface Uploader {
  nickName: string;
}

const UserEdit = () => {
  const selectFile = useRef<any>(null);

  const id = useSelector((state: RootState) => state.id.id);
  const nickname = useSelector((state: RootState) => state.nickName.nickName);
  const email = useSelector((state: RootState) => state.email.email);
  const profileUrl = useSelector((state: RootState) => state.imgUrl.imgUrl);
  const accessToken = cookie.load("accessToken");
  const [imagePath, changeUrl] = useState("");
  const [imgFile, setFile] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const cancelEdit: myPageState = {
    currIdx: 0,
    label: "회원 정보",
  };

  useEffect(() => {
    changeUrl(profileUrl);
  }, [dispatch, profileUrl]);

  const [editName, setEditName] = useState("");

  const changeProfile = (e: any) => {
    const img = e.target.files[0];
    changeUrl(URL.createObjectURL(img));
    setFile(img);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("multipartFile", imgFile);
    if (editName.trim() !== "") {
      const nickName: Uploader = { nickName: editName };
      formData.append(
        "nickName",
        new Blob([JSON.stringify(nickName)], {
          type: "application/json",
        })
      );
    } else {
      const nickName: Uploader = { nickName: nickname };
      formData.append(
        "nickName",
        new Blob([JSON.stringify(nickName)], {
          type: "application/json",
        })
      );
    }

    const response = async () => {
      if (accessToken) {
        await axios.put(`/api/myPage/${email}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Token": accessToken,
          },
        });
      }
    };

    // if (editName.trim() !== "") {
    response().then(async () => {
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
    });
    // }
    dispatch(setCurrIdx(cancelEdit));
  };

  return (
    <div className={styles["Container"]}>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className={styles["ProfileWrapper"]}>
          <div>
            <input
              type="file"
              accept="image/*"
              name="profile_img"
              onChange={changeProfile}
              className={styles["NoneInput"]}
              ref={selectFile}
            ></input>
            <label>
              <Image
                onClick={() => selectFile.current.click()}
                src={imagePath}
                className={styles["Avatar"]}
                alt="카카오프로필"
                width={140}
                height={140}
              />
            </label>
          </div>
          <div>
            <div className={styles["FormWrapper"]}>
              <label>
                <input
                  className={styles["Input"]}
                  type="text"
                  maxLength={5}
                  value={editName}
                  placeholder={nickname}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </label>
            </div>
            <div className={styles["Email"]}>{email}</div>
          </div>
        </div>
        <div className={styles["ButtonWrapper"]}>
          <Button type="submit" text="수정" />
          <Button
            type="click"
            text="취소"
            onClick={() => dispatch(setCurrIdx(cancelEdit))}
          />
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
