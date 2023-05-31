import Link from "next/link";
import axios from "axios";
import FiveStarRating from "../FiveStarRating/FiveStarRating";
import styles from "./UserBookmarkItem.module.css";
import { BsBookmarkFill } from "react-icons/bs";
import { getPlaceBookmark } from "@/src/store/reducers/PlaceBookmarkSlice";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import cookie from "react-cookies";
import { getCourseBookmark } from "@/src/store/reducers/CourseBoomarkSlice";

export interface bookmarkState {
  id: number;
  image: string;
  name: string;
  desc: string;
  rating: number;
  realId: number;
  isRating: boolean;
  isPlace: boolean;
  createdDate: string;
  contentId: string;
}

const UserBookmarkItem = (prop: bookmarkState) => {
  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };

  const appDispatch = useAppDispatch();
  const accessToken = cookie.load("accessToken");

  const delBookmark = () => {
    if (prop.isPlace) {
      const response = async () => {
        await axios.delete(`/api/place/bookmark/${prop.realId}`, {
          headers: {
            "Access-Token": accessToken,
          },
          withCredentials: true,
        });
      };
      response().then(() => {
        appDispatch(getPlaceBookmark(accessToken));
      });
    } else {
      const response = async () => {
        await axios.delete(`/api/course/bookmark/${prop.realId}`, {
          headers: {
            "Access-Token": accessToken,
          },
          withCredentials: true,
        });
      };
      response().then(() => {
        appDispatch(getCourseBookmark(accessToken));
      });
    }
  };

  return (
    <div key={prop.id} className={styles["bookmark-item"]}>
      {prop.isPlace === true ? (
        <Link href={`/place/${prop.realId}`}>
          <img src={prop.image} alt={prop.image} />
        </Link>
      ) : (
        <Link
          href={{
            pathname: "/course/[id]",
            query: { id: prop.realId },
          }}
        >
          <img src={prop.image} alt={prop.image} />
        </Link>
      )}

      <div>
        <div className={styles.bookmarkItem}>
          <BsBookmarkFill className={styles.bookmark} onClick={delBookmark} />
        </div>
        <h2>{prop.name}</h2>
        {prop.isPlace === true ? (
          <p>{prop.desc}</p>
        ) : (
          <p>{getFormattedDate(new Date(prop.createdDate))}</p>
        )}
        {prop.isRating === true ? (
          <p>
            <FiveStarRating rating={prop.rating.toString()} />
          </p>
        ) : (
          <p>{prop.desc}</p>
        )}
      </div>
    </div>
  );
};

export default UserBookmarkItem;
