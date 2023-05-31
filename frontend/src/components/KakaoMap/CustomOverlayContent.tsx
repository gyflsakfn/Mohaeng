import styles from "./CustomOverlayContent.module.css";
import Link from "next/link";
import React from "react";

interface objProps {
  title: string;
  id: number;
}

const CustomOverlayContent = ({ title, id }: objProps) => {
  return (
    <div className={styles.spot}>
      <Link className={styles.link} href={`/place/${id}`} target="_blank">
        <span className={styles.title}>{title}</span>
      </Link>
    </div>
  );
};

export default React.memo(CustomOverlayContent);
