import { UseInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Loader.module.css";

// Loader.tsx
type LoaderProps = Pick<
  UseInfiniteScroll,
  "isLoading" | "loadMoreCallback" | "isLastPage"
>;

const RotationAnimation = () => {
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsRotated(!isRotated);
    });

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles["loading-container"]}>
      <Image
        className={styles.img}
        src="/assets/loading.png"
        alt="Rotation Image"
        width={32}
        height={32}
        style={{
          transform: isRotated ? "rotate(360deg)" : "none",
          transition: "transform 2s ease-in-out",
        }}
      />
    </div>
  );
};

export const Loader = ({
  isLoading,
  isLastPage,
  loadMoreCallback,
}: LoaderProps) => {
  if (isLoading) return <RotationAnimation />;

  if (isLastPage)
    return (
      <p className={styles["no-results"]}>
        검색 결과가 더 이상 존재하지 않습니다.
      </p>
    );

  return (
    <div className={styles["loader-container"]} ref={loadMoreCallback}></div>
  );
};
