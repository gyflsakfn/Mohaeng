import styles from "./PlaceItem.module.css";
import Image from "next/image";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { content } from "@/src/store/reducers/PlaceSlice";
import axios from "axios";
import cookie from "react-cookies";
import { setPlace } from "@/src/store/reducers/PlaceSlice";
import { RootState } from "@/src/store/store";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { getPlaceBookmark } from "@/src/store/reducers/PlaceBookmarkSlice";
import FiveStarRating from "../FiveStarRating/FiveStarRating";
import { useRouter } from "next/router";
import { openModal } from "@/src/store/reducers/modalSlice";

const PlaceItem = ({
  name,
  firstImage,
  areaCode,
  placeId,
  averageRating,
  review,
  isBookmarked,
  contentId,
}: content) => {
  const accessToken = cookie.load("accessToken");

  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const page = useSelector((state: RootState) => state.page.page);
  const router = useRouter();

  const addBookmark = () => {
    if (!accessToken) {
      dispatch(openModal({ modalType: "LoginModal", isOpen: true }));
      return;
    }
    const response = async () => {
      await axios.post(
        `/api/place/bookmark/${placeId}`,
        {},
        {
          headers: {
            "Access-Token": accessToken,
          },
          withCredentials: true,
        }
      );
    };
    response().then(async () => {
      await axios
        .get(`/api/places`, {
          headers: {
            "Access-Token": accessToken,
          },
          params: {
            areaCode: areaCode,
            page: page,
          },
          withCredentials: true,
        })
        .then((res) => dispatch(setPlace(res.data.data)))
        .then(() => {
          appDispatch(getPlaceBookmark(accessToken));
        });
    });
  };

  const delBookmark = () => {
    if (!accessToken) {
      router.push("/");
      return;
    }
    const response = async () => {
      await axios.delete(`/api/place/bookmark/${placeId}`, {
        headers: {
          "Access-Token": accessToken,
        },
        withCredentials: true,
      });
    };
    response().then(async () => {
      await axios
        .get(`/api/places`, {
          headers: {
            "Access-Token": accessToken,
          },
          params: {
            areaCode: areaCode,
            page: page,
          },
          withCredentials: true,
        })
        .then((res) => dispatch(setPlace(res.data.data)))
        .then(() => {
          appDispatch(getPlaceBookmark(accessToken));
        });
    });
  };

  const handleClickBtn = () => {
    router.push(`/place/${placeId}`);
  };

  return (
    <div className={styles["place-item-container"]}>
      <Link href={`/place/${placeId}`}>
        <div className={styles["item-image"]}>
          <Image
            src={firstImage}
            alt={name}
            width={700}
            height={700}
            priority
          />
        </div>
      </Link>
      <div className={styles.keywordInfo}>
        <div className={styles.keywordDesc} onClick={handleClickBtn}>
          <p className={styles.title}>{name}</p>
          <FiveStarRating rating={averageRating.toString()} />
          <p className={styles.review}>{review}건의 리뷰</p>
        </div>
        <div className={styles.keywordBookmark}>
          {isBookmarked === true ? (
            <BsBookmarkFill onClick={delBookmark} className={styles.bookmark} />
          ) : (
            <BsBookmark onClick={addBookmark} className={styles.unbookmark} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceItem;
