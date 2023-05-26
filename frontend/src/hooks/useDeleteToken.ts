import { useRouter } from "next/router";
import cookie from "react-cookies";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { resetLog } from "../store/reducers/loginTokenSlice";

function useDeleteToken(): void {
  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = cookie.load("accessToken");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(0);

  useEffect(() => {
    if (accessToken && startTimeRef.current) {
      localStorage.setItem(
        "startTime",
        Math.floor(startTimeRef.current).toString()
      );
      localStorage.setItem(
        "remainingTime",
        Math.floor(remainingTimeRef.current).toString()
      );
    }
  }, [accessToken]);

  useEffect(() => {
    const deleteToken = (): void => {
      cookie.remove("accessToken", { path: "/" });
      dispatch(resetLog());
      router.replace("/");
    };

    const waitTime = 24 * 60 * 60 * 1000; // 24시간

    if (accessToken) {
      const storedStartTime = localStorage.getItem("startTime");
      const storedRemainingTime = localStorage.getItem("remainingTime");
      const currentTime = Date.now();
      const passedTime = storedStartTime
        ? currentTime - parseInt(storedStartTime)
        : 0;
      const remainingTime = storedRemainingTime
        ? parseInt(storedRemainingTime) - passedTime
        : waitTime;

      if (remainingTime > 0) {
        timerRef.current = setTimeout(deleteToken, remainingTime);
        startTimeRef.current = currentTime;
        remainingTimeRef.current = remainingTime;
      } else {
        deleteToken();
      }
    } else {
      clearTimeout(timerRef.current!);
      startTimeRef.current = null;
      remainingTimeRef.current = 0;
      localStorage.removeItem("startTime");
      localStorage.removeItem("remainingTime");
    }

    return (): void => {
      clearTimeout(timerRef.current!);
    };
  }, [accessToken]);

  // 콘솔로 확인
  // useEffect(() => {
  //   if (accessToken) {
  //     const interval = setInterval(() => {
  //       const remainingSeconds = Math.floor(remainingTimeRef.current / 1000);
  //       console.log("Remaining time:", remainingSeconds, "seconds");
  //       remainingTimeRef.current -= 1000;
  //     }, 1000);

  //     return (): void => {
  //       clearInterval(interval);
  //     };
  //   }
  // }, [accessToken]);
}

export default useDeleteToken;
