"use client";
import React, { useEffect, useState } from "react";

import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import cookie from "react-cookies";
import PlaceCard from "@/src/components/Main/PlaceCard";

import "swiper/css";
import "swiper/css/navigation";
import { ITopTenPlace } from "@/src/interfaces/Place";
import axios from "axios";

const PlaceCardSlider = () => {
  const [topTenPlace, setTopTenPlace] = useState<ITopTenPlace[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await cookie.load("accessToken");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/place/main`,
          {
            headers: {
              "Access-Token": accessToken,
              withCredentials: true,
            },
          }
        );
        setTopTenPlace(response.data.data.content);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const breakpoints = {
    // when window width is <= 640px
    640: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    },

    // when window width is <= 768px
    768: {
      slidesPerView: 2,
      slidesPerGroup: 1,
    },
    // when window width is <= 1024px
    1024: {
      slidesPerView: 3,
      slidesPerGroup: 2,
    },
    // when window width is <= 1200px
    1200: {
      slidesPerView: 4,
      slidesPerGroup: 3,
    },
  };

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={0}
      navigation
      breakpoints={breakpoints}
      // onSwiper={(swiper) => console.log(swiper)}
      // onSlideChange={() => console.log("slide change")}
    >
      {topTenPlace.length > 0 &&
        topTenPlace?.map((place, idx) => (
          <SwiperSlide key={idx}>
            <PlaceCard
              key={place.placeId}
              placeId={place.placeId}
              name={place.name}
              region={place.region}
              firstImage={place.firstImage}
              averageRating={place.averageRating}
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default PlaceCardSlider;
