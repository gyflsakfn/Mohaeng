import bannerImg from "/public/assets/banner-img.png";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./BannerSearch.module.css";

const BannerSearch = () => {
  return (
    <div className={styles["home-banner-container"]}>
      <div className={styles["banner-search-container"]}>
        <Image
          priority={true}
          className={styles["banner-image"]}
          src={bannerImg}
          alt="배너 이미지"
        />
      </div>
    </div>
  );
};

export default BannerSearch;
