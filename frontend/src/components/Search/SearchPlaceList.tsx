import styles from "./SearchPlaceList.module.css";
import axios from "axios";
import cookie from "react-cookies";
import SearchItem from "./SearchItem";
import Pagebar from "../Pagenation/Pagebar";
import ListContainer from "../UI/ListContainer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Keyword } from "@/src/interfaces/Keyword";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { setSearchPlace } from "@/src/store/reducers/searchPlaceSlice";
import { setPage } from "@/src/store/reducers/pageSlice";

export default function SearchPlaceList(): JSX.Element {
  const [searchResult, setSearchResult] = useState<Keyword[]>([]);
  const router = useRouter();
  const { keyword } = router.query;
  const dispatch = useDispatch();
  const page = useSelector((state: RootState) => state.page.page);
  const totalPages: number = useSelector(
    (state: RootState) => state.searchPlace.totalPages
  );
  const accessToken = cookie.load("accessToken");

  const handleBookmarkUpdate = (placeId: number, isBookmarked: boolean) => {
    setSearchResult((prevResult) => {
      return prevResult.map((place) => {
        if (place.placeId === placeId) {
          return {
            ...place,
            isBookmarked,
          };
        } else {
          return place;
        }
      });
    });
  };

  useEffect(() => {
    const fetchKeyword = async () => {
      try {
        const headers: { [key: string]: string } = {};
        if (accessToken) {
          headers["Access-Token"] = accessToken;
          headers.withCredentials = "true";
        }
        const res = await axios.get(`/api/place`, {
          params: {
            keyword: keyword,
            page: page,
          },
          headers: headers,
        });

        dispatch(setSearchPlace(res.data.data));
        setPage(totalPages);
        const { content } = res.data.data;
        setSearchResult(content);
      } catch (error) {
        console.log("Error", error);
      }
    };
    if (keyword) {
      fetchKeyword();
    }
  }, [keyword, page, accessToken]);

  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.h3}>검색하신 결과: {keyword} </h3>
        <ul className={styles.keywordList}>
          {searchResult?.length > 0 ? (
            <ListContainer>
              {searchResult?.map((place) => (
                <SearchItem
                  key={place.placeId}
                  name={place.name}
                  firstImage={place.firstImage}
                  contentId={place.contentId}
                  placeId={place.placeId}
                  isBookmarked={place.isBookmarked}
                  averageRating={place.averageRating}
                  reviewTotalElements={place.reviewTotalElements}
                  onBookmarkUpdate={handleBookmarkUpdate}
                />
              ))}
            </ListContainer>
          ) : (
            <div className={styles.div}>
              <p className={styles.noResult}>
                해당하는 검색 결과가 없습니다. 😢
              </p>
            </div>
          )}
        </ul>
        {totalPages !== 0 && totalPages ? (
          <Pagebar totalPage={totalPages} />
        ) : null}
      </section>
    </>
  );
}
