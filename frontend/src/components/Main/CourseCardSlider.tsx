"use client";

import React, { useEffect, useState } from "react";

import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import CourseCard from "@/src/components/Main/CourseCard";
import cookie from "react-cookies";

import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { IRecommandCourse } from "@/src/interfaces/Course.type";

const CourseCardSlider = () => {
  const [recommandCourse, setRecommandCourse] = useState<IRecommandCourse[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await cookie.load("accessToken");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/course/main`,
          {
            headers: {
              "Access-Token": accessToken,
            },
          }
        );
        setRecommandCourse(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const updateRecommandCourse = (updatedCourse: IRecommandCourse) => {
    const updatedCourses = recommandCourse.map((course) => {
      if (course.courseId === updatedCourse.courseId) {
        return {
          ...course,
          isLiked: updatedCourse.isLiked,
          likeCount: updatedCourse.likeCount,
        };
      } else {
        return course;
      }
    });
    updatedCourses.sort((a, b) => b.likeCount - a.likeCount);

    setRecommandCourse(updatedCourses); // 상태 업데이트
  };

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
      {recommandCourse.length > 0 &&
        recommandCourse.map((course) => (
          <SwiperSlide key={course.courseId}>
            <CourseCard
              courseId={course.courseId}
              title={course.title}
              region={course.region}
              courseDays={course.courseDays}
              content={course.content}
              thumbnailUrl={course.thumbnailUrl}
              likeCount={course.likeCount}
              isLiked={course.isLiked}
              onUpdateCourse={updateRecommandCourse}
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default CourseCardSlider;
