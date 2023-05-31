/** @type {import('next').NextConfig} */

const nextConfig = {
  fallback: true,
  reactStrictMode: false,
  swcMinify: true,
  output: "standalone",
  images: {
    domains: [
      "tong.visitkorea.or.kr",
      "cdn.visitkorea.or.kr",
      "k.kakaocdn.net",
      "mohaeng.s3.ap-northeast-2.amazonaws.com",
    ],
  },
  pageExtensions: ["jsx", "js", "ts", "tsx", "json"],
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [
      // {
      //   source: "/:path*",
      //   destination: "http://3.24.141.151/:path*",
      // },
      // 코스 상세를 보려면 위 코드는 주석 처리하고 아래 코드는 주석을 풀어주세요.
      // 다른 url 경로 추가
      {
        source: "/api/course/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/course/:path*`,
      },
      {
        source: "/api/myPage/course/bookMark",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/myPage/course/bookMark`,
      },
      {
        source: "/api/myPage/myReview",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/myPage/myReview`,
      },
      {
        source: "/api/myPage/course",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/myPage/course`,
      },
      {
        source: "/login/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/login/:path*`,
      },
      {
        source: "/loginInfo/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/loginInfo/:path*`,
      },
      {
        source: "/loginInfo",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/loginInfo`,
      },
      {
        source: "/oauth/token/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/oauth/token/:path*`,
      },
      {
        source: "/api/places/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/places/:path*`,
      },
      {
        source: "/api/place/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/place/:path*`,
      },
      {
        source: "/api/place/overview/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/place/overview/:path*`,
      },
      {
        source: "/api/review/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/review/:path*`,
      },
      {
        source: "/api/review/detail/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/review/detail/:path*`,
      },
      {
        source: "/api/review/:placeId/date",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/review/:placeId/date`,
      },
      {
        source: "/api/review/:placeId/rating",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/review/:placeId/rating`,
      },
      {
        source: "/api/myPage/place/bookMark",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/myPage/place/bookMark`,
      },
      {
        source: "/api/myPage/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/myPage/:path*`,
      },
      {
        source: "/api/place/main/:path",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/place/main/:path`,
      },
      {
        source: "/api/user/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/user/:path*`,
      },
      {
        source: "/api/course/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/course/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
