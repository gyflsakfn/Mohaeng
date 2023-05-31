import styles from "./CreateReview.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import cookie from "react-cookies";
import ReviewRating from "./ReviewRating";
import ReviewTextArea from "./ReviewTextarea";
import usePreventRefresh from "@/src/hooks/usePreventRefresh";
import { useRouterQuery } from "@/src/hooks/useRouterQuery";
import { AiFillCloseCircle } from "react-icons/ai";
import { PlaceInfo } from "../PlaceDetail/PlaceDetail";
// import { useAppDispatch } from "@/src/hooks/useReduxHooks";
// import { getMyReview } from "@/src/store/reducers/myReviewSlice";
// import { getPlaceBookmark } from "@/src/store/reducers/PlaceBookmarkSlice";

export default function CreateReview() {
  const accessToken = cookie.load("accessToken");
  const router = useRouter();
  const id = useRouterQuery("id");
  // const appDispatch = useAppDispatch();
  const [clicked, setClicked] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [content, setContent] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [star, setStar] = useState<number>();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  let rating = clicked.filter(Boolean).length;

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

  // * 상세 데이터중 placeId, name 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers: { [key: string]: string } = {};
        if (accessToken) {
          headers["Access-Token"] = accessToken;
          headers.withCredentials = "true";
        }
        const res = await axios.get(`/api/place/overview/${id}`, {
          headers,
        });
        if (Object.keys(res.data.data.content[0]).length > 0) {
          const { content } = res.data.data;
          setPlaceInfo({ ...placeInfo, ...content[0] });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // * 새로고침 방지
  usePreventRefresh();

  // *비동기적으로 받아오는 별점 개수 업데이트 확인
  useEffect(() => {
    // console.log(rating);
    setStar(star);
  }, [clicked]);

  // *별점 클릭
  const handleStarClick = (index: number): void => {
    let clickStates: boolean[] = [...clicked];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
  };

  // * 이미지 미리보기 (3장 제한)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    for (let i = 0; i < e.target.files!.length; i++) {
      const file = e.target.files![i];

      if (newImages.length < 3) {
        newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target!.result as string);
          setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);
      }
    }
    setImages(newImages);
  };

  // * 이미지 삭제
  const handleDeletePreview = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // *리뷰 백엔드로 전송
  const submitReview = async () => {
    if (rating === 0) {
      alert("별점을 입력해주세요");
      return false;
    } else if (content === "") {
      setErrorMsg("리뷰 내용을 입력해주세요");
      return false;
    } else if (content.length < 20) {
      setErrorMsg("리뷰 내용을 20자 이상 입력해주세요");
      return false;
    }
    const formData = new FormData();
    images.forEach((image) => {
      if (image instanceof File && image.size > 0) {
        formData.append("multipartFile", image);
      }
    });

    let review = {
      rating: rating,
      content: content,
    };
    formData.append(
      "review",
      new Blob([JSON.stringify(review)], { type: "application/json" })
    );

    try {
      const accessToken = await cookie.load("accessToken");
      const response = await axios
        .post(`/api/review/${id}`, formData, {
          headers: {
            "Access-Token": accessToken,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // appDispatch(getMyReview(accessToken));
          // appDispatch(getPlaceBookmark(accessToken));
          router.push(`/place/${id}`);
        });
    } catch (error) {
      router.push(`/place/${id}`);
      console.log(error);
    }
  };

  // 뒤로 가기
  const handleGoBack = () => {
    const confirmed = window.confirm(
      "작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?"
    );
    if (confirmed) {
      router.back();
    }
  };

  //* 리뷰 에러 메시지
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 250) {
      setContent(value);
    }
  };

  return (
    <>
      <section className={styles.registerReviewContainer}>
        <h2 className={styles.h2}>리뷰 작성</h2>
        <article className={styles.registerReview}>
          <p className={styles.boldTitle}>선택한 여행지</p>
          {placeInfo.name && (
            <h3 className={styles.reviewTitle}>{placeInfo.name}</h3>
          )}

          <div className={styles.ratingBox}>
            <strong className={styles.ratingTitle}>별점</strong>
            <ReviewRating clicked={clicked} onStarClick={handleStarClick} />
            <p className={styles.ratingDesc}>별점을 클릭해 주세요</p>
          </div>

          <div id="review" className={styles.form}>
            <ReviewTextArea value={content} onChange={handleChange} />
            <div className={styles.contentCheck}>
              {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
              <p className={styles.contentLength}>{content.length}/250</p>
            </div>

            <p className={styles.boldTitle}>사진 추가하기 (선택) </p>
            <label className={styles.chooseLabel} htmlFor="inputFile">
              <div className={styles.chooseFile}>사진 첨부</div>
            </label>
            <input
              type="file"
              id="inputFile"
              multiple
              accept="image/*"
              className={styles.imageForm}
              onChange={handleImageChange}
            />
            <span className={styles.inputFileDesc}>
              * 사진은 최대 3장까지 첨부할 수 있습니다.
            </span>

            <div className={styles.imgContainer}>
              {previews?.map((preview, index) => (
                <div className={styles.imgBox} key={index}>
                  <Image
                    className={styles.previewImg}
                    src={preview}
                    width={200}
                    height={200}
                    alt={`${preview}-${index}`}
                  />
                  <AiFillCloseCircle
                    className={styles.deleteImgBtn}
                    onClick={() => handleDeletePreview(index)}
                  />
                </div>
              ))}
            </div>
            <div className={styles.btnGroup}>
              <button className={styles.postBtn} onClick={submitReview}>
                등록
              </button>
              <button className={styles.cancelBtn} onClick={handleGoBack}>
                취소
              </button>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
