"use client";

import { palette, PaletteKeyTypes } from "@/src/styles/palette";
import Link from "next/link";
import styled from "styled-components";
import styles from "./RecommendedSection.module.css";

interface SectionStyle {
  children: any;
  title?: string;
  bgColor?: PaletteKeyTypes;
  linkUrl?: string;
}

const RecommendedSection = ({
  children,
  title,
  bgColor,
  linkUrl,
}: SectionStyle) => {
  const settingBgColor = bgColor ? palette[bgColor] : "#99D9D9";
  const style = { backgroundColor: settingBgColor };
  return (
    <section className={styles["recommended-container"]} style={style}>
      <div className={styles["recommended-container-title"]}>
        <h3>{title}</h3>
        {linkUrl && (
          <Link href={linkUrl}>
            <div className={styles["link-button"]}>더보기</div>
          </Link>
        )}
      </div>
      {children}
    </section>
  );
};

export default RecommendedSection;
