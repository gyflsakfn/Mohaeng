import styles from "./MyReview.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import MyReviewItem from "./MyReviewItem";
import { useEffect } from "react";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import cookie from "react-cookies";
import { getMyReview } from "@/src/store/reducers/myReviewSlice";

const MyReview = () => {
  const appDispatch = useAppDispatch();
  const accessToken = cookie.load("accessToken");
  const myReview = useSelector((state: RootState) => state.myReview.data);

  useEffect(() => {
    appDispatch(getMyReview(accessToken));
  }, []);

  return (
    <>
      <div className={styles.tabContainer}></div>
      <div className={styles["review-container"]}>
        {myReview.map((review) => (
          <MyReviewItem
            reviewId={review.reviewId}
            placeId={review.placeId}
            imgUrl={review.imgUrl}
            name={review.name}
            createdDate={review.createdDate}
            content={review.content}
            rating={review.rating}
            contentId={review.contendId}
          />
        ))}
      </div>
    </>
  );
};

export default MyReview;
