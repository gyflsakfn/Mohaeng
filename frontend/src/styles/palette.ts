// D: 진한 M: 중간 L: 연한
export const palette = {
  white: "var(--color-white)",
  black: "var(--color-black)",
  primary: "var(--color-primary)",
  MMint: "#02bebe",
  Dgreen: "#7AA874",
  Lsky: "#B4E4FF",
  Msky: "#62CDFF",
  Dsky: "#469DD2",
  Lbeige: "#FEFBE9",
  Lgrey: "var(--color-bg-lightgray)",
  Mgrey: "#f0f0f0",
  Dgrey: "var(--color-bg-gray)",
  Mpink: "#F7C8E0",
  Dpink: "#ee51a2",
  Dyellow: "#F2CD5C",
  MOrange: "#FFC686",
  LMarinBlue: "#7A6CCF",
};

export type PaletteKeyTypes = keyof typeof palette;
