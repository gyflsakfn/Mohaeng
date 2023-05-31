import {
  setEmail,
  setId,
  setNickname,
  setImgUrl,
  setToken,
} from "@/src/store/reducers/loginTokenSlice";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "./Loading";
import cookie from "react-cookies";

const KakaoLogin = () => {
  const router = useRouter();
  const [valid, setValid] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let code = new URL(window.location.href).searchParams.get("code");
    const kakaoCode = async () => {
      try {
        // 코드 전송
        const response = await axios.get(`/oauth/token?code=${code}`, {
          withCredentials: true,
        });
        const { accessToken } = response.data;
        const { refreshToken } = response.data;
        cookie.save("accessToken", accessToken, {
          path: "/",
        });
        cookie.save("refreshToken", refreshToken, {
          path: "/",
        });
        dispatch(setToken(accessToken));

        if (accessToken) {
          try {
            // loginInfo에서 정보 받아오기, 토큰 헤더에 담아서 전송
            axios.defaults.headers.common["accessToken"] = accessToken;
            const userRes = await axios.get(`/loginInfo`, {
              headers: {
                "Access-Token": `${accessToken}`,
              },
              withCredentials: true,
            });
            // 여기에서 받아온 유저 정보를 리덕스에 저장한다
            const { id, nickName, email, imgUrl } = userRes.data.data;
            dispatch(setId(id));
            dispatch(setEmail(email));
            dispatch(setNickname(nickName));
            dispatch(setImgUrl(imgUrl));
            router.replace("/");
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log("error");
        }
        setValid(true);
      } catch (e) {
        console.log(e);
        router.push("/");
      }
    };
    kakaoCode();
  }, [dispatch]);

  if (!valid) {
    return <Loading />;
  }
  return <></>;
};

export default KakaoLogin;
