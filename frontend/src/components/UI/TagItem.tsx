import { palette, PaletteKeyTypes } from "@/src/styles/palette";
import styles from "./TagItem.module.css";

const TagItem = ({
  text,
  bgColor,
  color = "white",
  size = "M",
  icon,
  isBorder = false,
}: {
  text: string;
  bgColor?: PaletteKeyTypes;
  color?: "black" | "white" | PaletteKeyTypes;
  size?: "L" | "M" | "S" | "SS";
  icon?: any;
  isBorder?: boolean;
}) => {
  const settingBgColor = bgColor ? palette[bgColor] : "var(--color-primary)";
  const settingBorder = isBorder
    ? "1px solid var(--color-border-semilight)"
    : undefined;
  const settingColor =
    color === "white"
      ? "var(--color-white)"
      : color === "black"
      ? "var(--color-text-basic)"
      : palette[color];
  const style = {
    backgroundColor: settingBgColor,
    color: settingColor,
    border: settingBorder,
  };
  return (
    <>
      <div
        className={`${styles["tag-item"]} ${styles[`tag-item-${size}`]}`}
        style={style}
      >
        <span className={styles.text}>
          {icon}
          {text}
        </span>
      </div>
    </>
  );
};

export default TagItem;
