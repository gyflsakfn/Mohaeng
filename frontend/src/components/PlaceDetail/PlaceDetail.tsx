import styles from "./PlaceDetail.module.css";
import Image from "next/image";
import axios from "axios";
import cookie from "react-cookies";
import PlaceBookmark from "@/src/components/Bookmark/PlaceBookmark";
import PlaceDetailMap from "@/src/components/PlaceDetail/PlaceDetailMap";
import Pagebar from "../Pagenation/Pagebar";
import ReviewItem from "../Review/ReviewItem";
import FiveStarRating from "../FiveStarRating/FiveStarRating";
import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { getPlaceBookmark } from "@/src/store/reducers/PlaceBookmarkSlice";
import { useRouterQuery } from "@/src/hooks/useRouterQuery";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/src/store/reducers/modalSlice";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ReviewData, setReview } from "@/src/store/reducers/reviewSlice";
import { RootState } from "@/src/store/store";
import { getMyReview } from "@/src/store/reducers/myReviewSlice";
import { BsThreeDots } from "react-icons/bs";

export interface PlaceInfo {
  placeId: number;
  name: string;
  areaCode: string;
  firstImage: string;
  contentId: string;
  address: string;
  mapX: string;
  mapY: string;
  overview: string;
  rating: string;
  review: string;
}

export default function PlaceDetail() {
  const accessToken = cookie.load("accessToken");
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const router = useRouter();
  const id = useRouterQuery("id");
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo>({
    placeId: 0,
    name: "",
    areaCode: "",
    firstImage: "",
    contentId: "",
    address: "",
    mapX: "",
    mapY: "",
    overview: "",
    rating: "",
    review: "",
  });

  const [bookMarked, setBookMarked] = useState(false);

  function handleCheckBookmark() {
    if (!accessToken) {
      dispatch(
        openModal({
          modalType: "LoginModal",
          isOpen: true,
        })
      );
    } else {
      handleBookmarkClick();
    }
  }

  // * 북마크
  const handleBookmarkClick = async () => {
    try {
      if (bookMarked === false) {
        const res = await axios.post(
          `/api/place/bookmark/${id}`,
          {},
          {
            headers: {
              "Access-Token": `${accessToken}`,
              withCredentials: true,
            },
          }
        );
        // .then(() => {
        //   appDispatch(getPlaceBookmark(accessToken));
        // });
      } else {
        const res = await axios.delete(`/api/place/bookmark/${id}`, {
          headers: {
            "Access-Token": `${accessToken}`,
            withCredentials: true,
          },
        });
        // .then(() => {
        //   appDispatch(getPlaceBookmark(accessToken));
        // });
      }
      setBookMarked(!bookMarked);
    } catch (error) {
      console.error(error);
    }
  };

  // * 상세 데이터
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers: { [key: string]: string } = {};
        if (accessToken) {
          headers["Access-Token"] = accessToken;
          headers.withCredentials = "true";
          headers["Cache-Control"] = "no-cache";
        }
        const res = await axios.get(`/api/place/overview/${id}`, {
          headers,
        });
        if (Object.keys(res.data.data.content[0]).length > 0) {
          const { content } = res.data.data;
          setPlaceInfo({ ...placeInfo, ...content[0] });
          setBookMarked(res.data.data.isBookmarked);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // * 리뷰 데이터
  const [reviewData, setReviewData] = useState<ReviewData[]>([]);
  const [selectedValue, setSelectedValue] = useState("highrating");
  const page = useSelector((state: RootState) => state.page.page);
  const totalPages: number = useSelector(
    (state: RootState) => state.review.totalPages
  );
  const totalElements = useSelector(
    (state: RootState) => state.review.totalElements
  );
  const averageRating = useSelector(
    (state: RootState) => state.review.averageRating
  );

  const currentUser = useSelector(
    (state: RootState) => state.nickName.nickName
  );

  // 정렬
  const handleChangeOption = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedValue(e.target.value);
  };

  // * 정렬별 데이터 조회
  useEffect(() => {
    async function fetchSelect() {
      try {
        let url = "";
        if (selectedValue === "highrating") {
          url = `/api/review/${id}/rating`;
        } else if (selectedValue === "latest") {
          url = `/api/review/${id}/date`;
        }

        const res = await axios.get(url, {
          params: {
            page: page,
          },
          withCredentials: true,
        });
        if (res.data.data && res.data.data.reviews) {
          dispatch(setReview(res.data.data));
          setReviewData(res.data.data.reviews);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (id) {
      fetchSelect();
    }
  }, [selectedValue, page, id]);

  // * 리뷰 전체 조회
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`/api/review/${id}/rating`, {
          params: {
            page: page,
          },
          withCredentials: true,
        });
        dispatch(setReview(res.data.data));
        setReviewData(res.data.data.reviews);
      } catch (err) {
        console.error(err);
      }
    };
    if (id && id !== undefined) {
      fetchReview();
    }
  }, [page, id]);

  // * 리뷰 작성 버튼 클릭
  const handleClickReviewBtn = () => {
    if (!accessToken && !currentUser) {
      dispatch(
        openModal({
          modalType: "LoginModal",
          isOpen: true,
        })
      );
    } else {
      if (id) {
        router.push(`/review/create-review/${id}`);
      } else {
        console.log("placeId is undefined");
      }
    }
  };

  // * 리뷰 아이템 삭제
  const handleDelete = async (reviewId: number) => {
    const confirmed = window.confirm("리뷰를 삭제하시겠습니까?");
    if (confirmed) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/review/detail/${reviewId}`,
          {
            headers: {
              "Access-Token": accessToken,
            },
          }
        );
        const res = await axios.get(`/api/review/${id}/rating`, {
          params: {
            page: page,
          },
          withCredentials: true,
        });
        dispatch(setReview(res.data.data));
        appDispatch(getPlaceBookmark(accessToken));
        appDispatch(getMyReview(accessToken));
        setReviewData(
          reviewData.filter((review) => review.reviewId !== reviewId)
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <section className={styles.placeDetail}>
        <div className={styles.detailHeader}>
          <div className={styles.headerTitle}>
            <h2 className={styles.h2}>{placeInfo.name}</h2>
            <p>
              <FaMapMarkerAlt />
              &nbsp;{placeInfo.address}
            </p>
          </div>
          <div className={styles.bookMarkBox}>
            {bookMarked === false ? (
              <p className={styles.bookMarkText}>북마크에 추가</p>
            ) : (
              <p className={styles.bookMarkText}>북마크 취소</p>
            )}
            <PlaceBookmark
              bookMarked={bookMarked}
              onToggle={handleCheckBookmark}
            />
          </div>
        </div>
        <div className={styles.detailContent}>
          <div className={styles.imgBox}>
            {placeInfo.firstImage && (
              <Image
                className={styles.img}
                src={placeInfo.firstImage}
                width={700}
                height={700}
                alt={placeInfo.name}
                priority
              />
            )}
          </div>
          <div className={styles.detailMap}>
            <div className={styles.map} id="map">
              <PlaceDetailMap
                latitude={placeInfo.mapY}
                longitude={placeInfo.mapX}
              />
            </div>
          </div>
        </div>
        <div className={styles.detailDesc}>
          <p className={styles.descTitle}>세부 설명</p>
          <p className={styles.descInfo}>{placeInfo.overview}</p>
        </div>
      </section>

      <section className={styles.reviewSection}>
        <main className={styles.reviewContainer}>
          <div className={styles.reviewTitle}>
            <div className={styles.titleBox}>
              <h2 className={styles.reviewH2}>리뷰</h2>
            </div>
            <div className={styles.reviewInfo}>
              <p className={styles.reviewCount}>
                <strong>{totalElements}</strong>
              </p>
            </div>
          </div>
          <span className={styles.reviewAverage}>
            <FiveStarRating rating={averageRating.toString()} />
          </span>
          <aside className={styles.reviewNav}>
            <select
              className={styles.select}
              value={selectedValue}
              onChange={handleChangeOption}
            >
              <option key="highrating" value="highrating">
                별점 높은 순
              </option>
              <option key="latest" value="latest">
                최신순
              </option>
            </select>
            <button className={styles.reviewBtn} onClick={handleClickReviewBtn}>
              리뷰 작성
            </button>
          </aside>
          <div className={styles.reviewList}>
            {reviewData?.map((review) => (
              <ReviewItem
                key={review.reviewId}
                reviewId={review.reviewId}
                nickname={review.nickname}
                memberImage={review.memberImage}
                rating={review.rating}
                content={review.content}
                createdDate={review.createdDate}
                imgUrl={review.imgUrl}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </main>
      </section>
      {totalPages !== 0 && totalPages ? (
        <Pagebar totalPage={totalPages} />
      ) : null}
    </>
  );
}
