import styles from "./index.module.css";
import PlaceList from "@/src/components/Place/PlaceList";
import AreaSelector from "@/src/components/Filter/AreaSelector";
import PageBar, { totalPageProps } from "@/src/components/Pagenation/Pagebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { setPlace } from "@/src/store/reducers/PlaceSlice";
import { setPage } from "@/src/store/reducers/pageSlice";

export default function Place() {
  const dispatch = useDispatch();
  const { areaCode } = useSelector((state: RootState) => state.filter.area);
  const page = useSelector((state: RootState) => state.page.page);
  const totalPages: number = useSelector(
    (state: RootState) => state.place.totalPages
  );

  useEffect(() => {
    dispatch(setPage(1));
    const response = async () => {
      await axios
        .get(`/places`, {
          params: {
            areaCode: areaCode,
            page: page,
          },
          withCredentials: true,
        })
        .then((res) => console.log(res.data.data));
    };
    response();
  }, [areaCode]);

  useEffect(() => {
    console.log("AreaCode is " + areaCode);
    const response = async () => {
      await axios
        .get(`/places`, {
          params: {
            areaCode: areaCode,
            page: page,
          },
          withCredentials: true,
        })
        .then((res) => dispatch(setPlace(res.data.data)));
    };
    response();
  }, [page]);

  return (
    <main className={styles.main}>
      <div className={styles["place-container"]}>
        <div className={styles["place-header-container"]}>
          <h1>여행지 목록</h1>
        </div>
        <div className={styles["place-body-container"]}>
          <div className={styles["place-body-head"]}></div>
          <AreaSelector />
          <PlaceList />
          <PageBar totalPage={totalPages} />
        </div>
      </div>
    </main>
  );
}
