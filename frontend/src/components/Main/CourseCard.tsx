import Image from "next/image";
import { useRouter } from "next/router";
import IsLikeState from "../UI/IsLikeState";
import styles from "./CourseCard.module.css";

const CourseCard = ({
  courseId,
  title,
  content,
  thumbnailUrl,
  likeCount,
  isLiked,
}: any) => {
  const router = useRouter();

  const handleCourseCard = () => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className={styles["course-card-container"]} onClick={handleCourseCard}>
      <div className={styles["course-image-container"]}>
        <Image
          src={thumbnailUrl}
          alt={title}
          width={700}
          height={700}
          priority
        />
        <IsLikeState likeCount={likeCount} isLiked={isLiked} />
      </div>
      <div className={styles["course-card-content"]}>
        <div className={styles["course-card-title"]}>
          <h3>{title}</h3>
        </div>
        <div className={styles["course-card-desc"]}>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
