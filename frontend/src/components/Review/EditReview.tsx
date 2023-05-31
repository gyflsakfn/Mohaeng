import styles from "./CreateReview.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import cookie from "react-cookies";
import ReviewRating from "./ReviewRating";
import usePreventRefresh from "@/src/hooks/usePreventRefresh";
import { AiFillCloseCircle } from "react-icons/ai";
import { useRouterQuery } from "@/src/hooks/useRouterQuery";
import { PlaceInfo } from "../PlaceDetail/PlaceDetail";
// import { useAppDispatch } from "@/src/hooks/useReduxHooks";
// import { getMyReview } from "@/src/store/reducers/myReviewSlice";
// import { getPlaceBookmark } from "@/src/store/reducers/PlaceBookmarkSlice";

export interface formData {
  reviewId: number;
  nickname: string;
  content: string;
  likeCount: number;
  rating: string;
  createdDate: string;
  imageUrls: string[];
}

export default function EditReview() {
  // const appDispatch = useAppDispatch();
  const accessToken = cookie.load("accessToken");
  const router = useRouter();
  const { reviewId } = router.query;
  const id = useRouterQuery("id");

  const [clicked, setClicked] = useState<boolean[]>(Array(5).fill(false));
  const [content, setContent] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [reviewForm, setReviewForm] = useState<formData>({
    reviewId: 0,
    nickname: "",
    content: "",
    likeCount: 0,
    rating: "",
    createdDate: "",
    imageUrls: [],
  });
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

  // * 수정 전 별점 보여주기
  useEffect(() => {
    setClicked(Array(5).fill(false).fill(true, 0, parseInt(reviewForm.rating)));
  }, [reviewForm.rating]);

  // * 리뷰데이터 받아오기
  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        const res = await axios.get(`/api/review/detail/${reviewId}`, {
          headers: {
            "Access-Token": accessToken,
          },
        });
        // console.log(res.data.data);
        setReviewForm({
          ...res.data.data,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviewDetail();
  }, [reviewId]);

  // * 별점 클릭
  const handleStarClick = (index: number): void => {
    let clickStates: boolean[] = [...clicked];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
  };

  // * 이미지 미리보기(3장 제한)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    for (let i = 0; i < e.target.files!.length; i++) {
      const file = e.target.files![i];

      if (previews.length + reviewForm.imageUrls.length < 3) {
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

  // * 이미지 미리보기 삭제
  const handleDeletePreview = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // * 받아온 데이터 이미지 삭제
  const handleDeleteImage = (index: number) => {
    const newImageUrls = [...reviewForm.imageUrls];
    newImageUrls.splice(index, 1);
    setReviewForm({
      ...reviewForm,
      imageUrls: newImageUrls,
    });
  };

  // * 리뷰 백엔드로 전송
  const submitReview = async () => {
    if (rating === 0) {
      alert("별점을 입력해주세요");
      return false;
    } else if (content === "") {
      setErrorMsg("리뷰 내용을 입력해주세요");
      return;
    } else if (content.length < 20) {
      setErrorMsg("리뷰 내용을 20자 이상 입력해주세요");
      return false;
    }
    const formData = new FormData();
    const getImageBlob = async (url: string): Promise<[Blob, string]> => {
      const filename = url.substring(url.lastIndexOf("/") + 1);
      const res = await fetch(url);
      const blob = await res.blob();
      return [blob, filename];
    };

    // * 기존에 업로드한 이미지 파일이 있으면 받아서 다시 폼데이터로
    if (reviewForm.imageUrls.length > 0) {
      const imageBlobs = await Promise.all(
        reviewForm.imageUrls.map((url) => getImageBlob(url))
      );
      imageBlobs.forEach(([blob, filename]) => {
        formData.append("multipartFile", blob, filename);
      });
    }
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
      const response = await axios
        .put(`/api/review/detail/${reviewId}`, formData, {
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

  // * 뒤로 가기
  const handleGoBack = () => {
    const confirmed = window.confirm(
      "작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?"
    );
    if (confirmed) {
      router.back();
    }
  };

  // * 리뷰 에러메시지
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 250) {
      setContent(value);
    }
  };

  useEffect(() => {
    setContent(reviewForm.content);
  }, [reviewForm]);

  return (
    <>
      <section className={styles.registerReviewContainer}>
        <h2 className={styles.h2}>리뷰 수정</h2>
        <article className={styles.registerReview}>
          <p className={styles.boldTitle}>선택한 여행지</p>
          <h3 className={styles.reviewTitle}>{placeInfo.name}</h3>

          <div className={styles.ratingBox}>
            <strong className={styles.ratingTitle}>별점</strong>
            <ReviewRating clicked={clicked} onStarClick={handleStarClick} />
            <p className={styles.ratingDesc}>별점을 클릭해 주세요</p>
          </div>

          <div id="review" className={styles.form}>
            <label htmlFor="review" className={styles.boldTitle}>
              리뷰 내용
            </label>
            <textarea
              value={content}
              className={styles.formTxtArea}
              name="review"
              id="review"
              placeholder="방문한 곳은 어떠셨나요? 당신의 경험을 공유해보세요!"
              required={true}
              onChange={handleChange}
            ></textarea>
            <div className={styles.contentCheck}>
              {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
              <p className={styles.contentLength}>{content.length}/250</p>
            </div>

            <p className={styles.boldTitle}>사진 추가하기 (선택)</p>
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
              {reviewForm.imageUrls?.map((preview, index) => (
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
                    onClick={() => handleDeleteImage(index)}
                  />
                </div>
              ))}
            </div>
            <div className={styles.btnGroup}>
              <button className={styles.postBtn} onClick={submitReview}>
                수정
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
