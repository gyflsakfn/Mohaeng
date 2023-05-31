import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

// 위도, 경도 (mapY, mapX 좌표)
interface DetailMapProps {
  latitude: string;
  longitude: string;
}

const PlaceDetailMap = ({ latitude, longitude }: DetailMapProps) => {
  useEffect(() => {
    const { kakao } = window;
    const mapScript = document.createElement("script");

    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APIKEY}&autoload=false`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(latitude, longitude),
          draggable: true,
          // 지도 생성할 때 확대, 축소 설정하는 옵션
        };
        // 지도 생성
        const map = new kakao.maps.Map(container, options);
        // 좌표로 주소 얻기
        var geocoder = new kakao.maps.services.Geocoder();
        const markerPosition = new kakao.maps.LatLng(latitude, longitude);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
        var mapTypeControl = new kakao.maps.MapTypeControl();

        // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
        // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
  }, [latitude, longitude]);

  return (
    <div
      id="map"
      style={{
        width: "400px",
        height: "300px",
      }}
    ></div>
  );
};

export default PlaceDetailMap;
