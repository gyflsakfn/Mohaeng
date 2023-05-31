import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { setPage } from "@/src/store/reducers/pageSlice";
import { useEffect, useState } from "react";
import styles from "./Pagebar.module.css";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
export interface totalPageProps {
  totalPage: number;
}

const Pagebar = (totalPage: totalPageProps) => {
  const dispatch = useDispatch();

  const page = useSelector((state: RootState) => state.page.page);
  const maxPage = Math.ceil(totalPage?.totalPage / 10);

  const [pageNumbers, setPageNumber] = useState<number[]>([]);

  const [pagePer, setPagePer] = useState(0);

  useEffect(() => {
    const array = [];
    for (let i = 1; i <= 10; i++) {
      array.push(pagePer * 10 + i);
    }
    setPageNumber(array);
    dispatch(setPage(pagePer * 10 + 1));
  }, [pagePer]);

  useEffect(() => {
    if (page === 1) {
      setPagePer(0);
    }
  }, [page]);

  return (
    <div className={styles.PageContainer}>
      <button
        className={`${styles.prev} ${styles.button}`}
        onClick={() => {
          pagePer > 0 && setPagePer(pagePer - 1);
        }}
      >
        <MdKeyboardDoubleArrowLeft />
      </button>
      <ul className={styles.pagination}>
        {pageNumbers.length > 0 &&
          pageNumbers.map((number) => (
            <li
              key={number}
              className={`${styles["page-item"]} ${
                page === number && styles.active
              }`}
              onClick={() => dispatch(setPage(number))}
            >
              {number <= totalPage.totalPage && number}
            </li>
          ))}
      </ul>
      <button
        className={`${styles.next} ${styles.button}`}
        onClick={() => {
          pagePer < maxPage - 1 && setPagePer(pagePer + 1);
        }}
      >
        <MdKeyboardDoubleArrowRight />
      </button>
    </div>
  );
};

export default Pagebar;
