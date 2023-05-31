import styles from "./CreateReview.module.css";
import styled from "styled-components";
import { AiFillStar } from "react-icons/ai";

type RatingProps = {
  clicked: boolean[];
  onStarClick: (index: number) => void;
};

const ReviewRating = ({ clicked, onStarClick }: RatingProps) => {
  const starArray = [0, 1, 2, 3, 4];
  const rating = clicked.filter(Boolean).length;

  return (
    <Stars>
      {starArray.map((el) => {
        return (
          <AiFillStar
            fontSize={40}
            key={el}
            id={`${el}`}
            onClick={() => onStarClick(el)}
            className={`${clicked[el] && "yellowStar"}`}
          />
        );
      })}
      <p className={styles.ratingTxt}>
        {rating === 5
          ? "5.0"
          : rating === 4
          ? "4.0"
          : rating === 3
          ? "3.0"
          : rating === 2
          ? "2.0"
          : rating === 1
          ? "1.0"
          : "0.0"}
      </p>
    </Stars>
  );
};

export default ReviewRating;

const Stars = styled.div`
  width: 250px;
  display: flex;
  padding-top: 5px;

  & svg {
    color: var(--color-border-semi);
    cursor: pointer;
  }

  :hover svg {
    color: #fcc419;
  }

  & svg:hover ~ svg {
    color: var(--color-border-semi);
  }

  .yellowStar {
    color: #fcc419;
  }
`;
