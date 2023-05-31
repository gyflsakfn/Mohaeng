import { ChangeEvent } from "react";
import styles from "./CreateReview.module.css";

interface ReviewTextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}
export default function ReviewTextarea({
  value,
  onChange,
}: ReviewTextareaProps) {
  return (
    <>
      <label htmlFor="review" className={styles.boldTitle}>
        리뷰 내용
      </label>
      <textarea
        value={value}
        className={styles.formTxtArea}
        name="review"
        id="review"
        placeholder="방문한 곳은 어떠셨나요? 당신의 경험을 공유해보세요!"
        required={true}
        onChange={onChange}
      ></textarea>
    </>
  );
}
