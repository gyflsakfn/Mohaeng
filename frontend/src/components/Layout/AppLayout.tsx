import styles from "./AppLayout.module.css";
import Footer from "./Footer";
import Header from "../Header/Header";

const AppLayout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className={styles["content-container"]}>{props.children}</div>
      <Footer />
    </>
  );
};

export default AppLayout;
