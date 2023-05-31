import Link from "next/link";
import styles from "./MyReviewItem.module.css";
import FiveStarRating from "../FiveStarRating/FiveStarRating";

export interface MyReviewItemProps {
  reviewId: number;
  placeId: number;
  name: string;
  content: string;
  rating: string;
  imgUrl: string;
  createdDate: string;
  contentId: string;
}
const MyReviewItem = (myReview: MyReviewItemProps) => {
  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };

  return (
    <div key={myReview.reviewId} className={styles["myReview-item"]}>
      <Link
        href={`/place/${myReview.placeId}`}
        // href={{
        //   pathname: "/place/[id]",
        //   query: {
        //     contentId: myReview.contentId,
        //     placeId: myReview.placeId,
        //     name: myReview.name,
        //   },
        // }}
        // as={`/place/${myReview.placeId}`}
      >
        <img src={myReview.imgUrl} alt={myReview.name} className={styles.img} />
      </Link>
      <div>
        <h2>{myReview.name}</h2>
        <p>{getFormattedDate(new Date(myReview.createdDate))}</p>
        <p>
          <FiveStarRating rating={myReview.rating} />
        </p>
        <p>{myReview.content}</p>
      </div>
    </div>
  );
};
export default MyReviewItem;
