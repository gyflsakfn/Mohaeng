import Image from "next/image";
import styles from "./UserProfile.module.css";

const UserProfile = ({
  url,
  nickName,
  size = "M",
}: {
  url: string;
  nickName: string;
  size?: "L" | "M" | "S";
}) => {
  return (
    <>
      <ul
        className={`${styles["profile-container"]} ${
          styles[`tag-item-${size}`]
        }`}
      >
        <div className={styles["profile-img-box"]}>
          <Image
            className={styles["profile-img"]}
            src={url}
            alt="카카오프로필"
            width={43}
            height={43}
          />
        </div>
        <div className={styles["profile-name"]}>{nickName}</div>
      </ul>
    </>
  );
};

export default UserProfile;
