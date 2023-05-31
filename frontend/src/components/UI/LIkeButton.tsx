import React from "react";
import { BsHeartFill, BsHeart } from "react-icons/bs";

import styles from "./LIkeButton.module.css";

interface LikeButtonProps {
  onClick: any;
  isLiked: boolean;
  likeCount: number;
}

const LIkeButton = ({ isLiked, likeCount, onClick }: LikeButtonProps) => {
  return (
    <>
      <div className={styles.like}>
        {isLiked ? (
          <BsHeartFill className={styles.heart} onClick={onClick} />
        ) : (
          <BsHeart className={styles.heart} onClick={onClick} />
        )}
        <div className={styles.likeCount}>{likeCount}</div>
      </div>
    </>
  );
};

export default LIkeButton;
