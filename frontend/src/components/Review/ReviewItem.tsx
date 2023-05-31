import styles from "./ReviewItem.module.css";
import Image from "next/image";
import FiveStarRating from "../FiveStarRating/FiveStarRating";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { useRouter } from "next/router";
import { useRouterQuery } from "@/src/hooks/useRouterQuery";

type ReviewProps = {
  reviewId: number;
  nickname: string;
  memberImage: string;
  content: string;
  imgUrl: string[];
  rating: string;
  createdDate: string;
  onDelete: (reviewId: number) => void;
};

export default function ReviewItem({
  reviewId,
  nickname,
  memberImage,
  rating,
  content,
  createdDate,
  imgUrl,
  onDelete,
}: ReviewProps) {
  const router = useRouter();
  const currentUser = useSelector(
    (state: RootState) => state.nickName.nickName
  );
  const isUser = nickname === currentUser;
  const [isExpanded, setIsExpanded] = useState(false);
  const id = useRouterQuery("id");

  const handleDelete = () => {
    onDelete(reviewId);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article className={styles.reviewBox}>
      <div className={styles.reviewer}>
        <Image
          className={styles.userImg}
          src={memberImage}
          width={50}
          height={50}
          alt={nickname}
        />
        <div className={styles.reviewerInfo}>
          <div className={styles.rating}>
            <FiveStarRating rating={rating.toString()} />
          </div>
          <p className={styles.reviewerId}>
            {nickname}&nbsp;|&nbsp;{createdDate}
          </p>
        </div>
        {isUser ? (
          <div className={styles.btnGroup}>
            <button
              onClick={() =>
                router.push({
                  pathname: `/review/edit-review/${id}`,
                  query: {
                    reviewId: reviewId,
                  },
                })
              }
              className={styles.btn}
            >
              수정
            </button>
            <button onClick={handleDelete} className={styles.btn}>
              삭제
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className={styles.reviewContent}>
        {content.length && imgUrl?.length > 0 ? (
          isExpanded ? (
            <div className={styles.reviewItem}>
              <p className={styles.reviewTxt}>{content}</p>
              <div className={styles.reviewImgBox}>
                {imgUrl.map((imgUrl, index) => (
                  <div className={styles.reviewImg} key={index}>
                    <Image
                      src={imgUrl}
                      width={200}
                      height={180}
                      alt={`img-${index}`}
                    />
                  </div>
                ))}
              </div>
              <button onClick={toggleExpand} className={styles.showMoreBtn}>
                접기
              </button>
            </div>
          ) : (
            <div>
              <p className={styles.reviewTxt}>{content.substring(0, 70)}...</p>
              <button onClick={toggleExpand} className={styles.showMoreBtn}>
                더 보기
              </button>
            </div>
          )
        ) : (
          <div className={styles.reviewItem}>
            <p className={styles.reviewTxt}>{content}</p>
            {imgUrl?.length > 0 && (
              <div className={styles.reviewImgBox}>
                {imgUrl.map((imgUrl, index) => (
                  <div className={styles.reviewImg} key={index}>
                    <Image
                      className={styles.reviewImgUrl}
                      src={imgUrl}
                      width={230}
                      height={200}
                      alt={`img-${index}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
