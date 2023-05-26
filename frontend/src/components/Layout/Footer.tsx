import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
  const curYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>
        © {curYear} Copyright ⓒ Mohaeng Corp. All rights reserved ❤️ by&nbsp;
        <Link href="https://github.com/Mohaeng2023/Mohaeng">Team Mohaeng</Link>
      </p>
    </footer>
  );
};

export default Footer;
