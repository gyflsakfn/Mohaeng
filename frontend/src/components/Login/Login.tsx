import styles from "./Login.module.css";
import Image from "next/image";
import Link from "next/link";
import btnKakao from "/public/assets/btnKakao.png";
import { KAKAO_AUTH_URL } from "../../pages/api/auth/OAuth";

export default function Login() {
  return (
    <>
      <section className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>로그인 / 회원가입</h2>
        <p className={styles.loginInfo}>
          간편하게 로그인하고 모두의 여행을 경험해보세요
        </p>
        <Link className={styles.link} href={KAKAO_AUTH_URL}>
          <button className={styles.kakaoBtn}>
            <Image
              className={styles.kakaoLogin}
              src={btnKakao}
              alt="카카오 로그인"
              width={352}
              height={54}
            />
          </button>
        </Link>

        <p className={styles.footerDesc}>
          로그인 또는 회원가입 시, 모두의 여행 이용약관 및 개인정보 정책에
          동의한 것으로 간주합니다.
        </p>
      </section>
    </>
  );
}
