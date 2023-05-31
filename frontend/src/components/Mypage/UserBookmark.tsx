import styles from "./UserBookmark.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import UserBookmarkItem from "./UserBookmarkItem";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import cookie from "react-cookies";
import { getCourseBookmark } from "@/src/store/reducers/CourseBoomarkSlice";
import { getPlaceBookmark } from "@/src/store/reducers/PlaceBookmarkSlice";

const UserBookmark = () => {
  const appDispatch = useAppDispatch();
  const accessToken = cookie.load("accessToken");

  const courseBookmark = useSelector(
    (state: RootState) => state.courseBookmark.data
  );
  const placeBookmark = useSelector(
    (state: RootState) => state.placeBookmark.data
  );

  useEffect(() => {
    appDispatch(getCourseBookmark(accessToken));
    appDispatch(getPlaceBookmark(accessToken));
  }, []);

  const [activeTab, setActiveTab] = useState("place");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tab} ${
            activeTab === "place" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("place")}
        >
          여행지
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "course" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("course")}
        >
          코스
        </div>
      </div>
      <div className={styles["bookmark-container"]}>
        {activeTab === "place"
          ? placeBookmark.map((bookmark) => (
              <UserBookmarkItem
                id={bookmark.bookMarkId}
                name={bookmark.placeName}
                image={bookmark.imgUrl}
                desc={bookmark.address}
                rating={bookmark.rating}
                realId={bookmark.placeId}
                isRating={true}
                isPlace={true}
                createdDate="123"
                contentId={bookmark.contendId}
              />
            ))
          : courseBookmark.map((bookmark) => (
              <UserBookmarkItem
                id={bookmark.bookMarkId}
                name={bookmark.courseTitle}
                image={bookmark.imgUrl}
                desc={bookmark.content}
                rating={0}
                realId={bookmark.courseId}
                isRating={false}
                isPlace={false}
                createdDate={bookmark.createdDate}
                contentId=""
              />
            ))}
      </div>
    </>
  );
};

export default UserBookmark;
