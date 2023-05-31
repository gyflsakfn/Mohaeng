import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./HeaderLogo.module.css";
import { resetFilter } from "@/src/store/reducers/FilterSlice";
import { myPageState, setCurrIdx } from "@/src/store/reducers/mypageSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";

const HeaderLogo = ({ setActiveLink }: any) => {
  const [logoSrc, setLogoSrc] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      const newLogoSrc =
        window.innerWidth <= 600
          ? "/assets/logo_mobile.png"
          : "/assets/logo_desktop.png";
      if (newLogoSrc !== logoSrc) {
        setLogoSrc(newLogoSrc);
      }
    };

    // 처음 한 번 실행
    handleResize();

    // 윈도우 리사이즈 이벤트 발생 시 handleResize 실행
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 unmount될 때 이벤트 리스너 삭제
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [logoSrc]);

  const handleClickLogo = () => {
    router.push("/");
    setActiveLink(null);
    dispatch(resetFilter());

    const currComponent: myPageState = {
      currIdx: 0,
      label: "회원정보",
    };

    dispatch(setCurrIdx(currComponent));
  };

  return (
    <div className={styles["logo-wrapper"]}>
      {logoSrc && (
        <Image
          src={logoSrc}
          alt="logo"
          width={200}
          height={80}
          className={styles.logo}
          onClick={handleClickLogo}
        />
      )}
    </div>
  );
};

export default HeaderLogo;
