interface IKakaoShare {
  title: string;
  content: string;
  thumbnailUrl: string;
  likeCount: number;
  courseId: number;
}

export function kakaoShare({
  title,
  content,
  thumbnailUrl,
  likeCount,
  courseId,
}: IKakaoShare) {
  if (window.Kakao) {
    const kakao = window.Kakao;

    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAOMAP_APIKEY);
    }

    kakao.Share.sendCustom({
      templateId: 93303,
      templateArgs: {
        title: title,
        desc: content,
        thumb: thumbnailUrl,
        likeCount: likeCount,
        path: `course/${courseId}`,
      },
    });
  }
}
