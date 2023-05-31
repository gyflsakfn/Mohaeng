import styles from "./index.module.css";
import RecommendedSection from "../components/Main/RecommendedSection";
import PlaceCardSlider from "../components/Main/PlaceCardSlider";
import CourseCardSlider from "../components/Main/CourseCardSlider";
import BannerSearch from "../components/Main/BannerSearch";
// import BoardFilters from "../components/Main/BoardFilters";
// import BoardContainer from "../components/Main/BoardContainer";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <BannerSearch />
        <div className={styles["home-body-container"]}>
          <div className={styles["home-content-container"]}>
            <RecommendedSection
              title="별점 Top 10 여행지"
              bgColor="Mgrey"
              linkUrl="place"
            >
              <PlaceCardSlider />
            </RecommendedSection>
            <RecommendedSection
              title="많은 사람들이 좋아하는 코스"
              bgColor="Mgrey"
              linkUrl="course"
            >
              <CourseCardSlider />
            </RecommendedSection>
          </div>
        </div>
      </main>
    </>
  );
}
