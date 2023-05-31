import { placesName } from "./Course.type";

export interface CourseList {
  courseId?: number;
  title: string;
  likeCount: number;
  courseDays?: string;
  createdDate?: string;
  thumbnailUrl: string;
  isPublished?: boolean;
  content?: string;
  places?: string;
}

export type CourseListProps = {
  courseId: number;
  title: string;
  content: string;
  likeCount: number;
  courseDays: string;
  thumbnailUrl: string;
  isBookmarked: boolean;
  isLiked: boolean;
  places: string;
};

export interface RoughMapTitle {
  RoughMapData: string;
  onClose: any;
}

export interface CourseDetailType {
  courseId: number;
  title: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  courseDays: string;
  region: string;
  content: string;
  likeCount: number;
  createdDate: string;
  isBookmarked: boolean;
  isLiked: boolean;
  nickname: string;
  places?: any;
}

export interface CourseDetailPlaces {
  placeId: number;
  imgUrl: string;
  name: string;
  address: string;
  mapX: string;
  mapY: string;
}

export interface kakaoPlaces {
  placeId: number;
  name: string;
  mapX: string;
  mapY: string;
  imgUrl: string;
  address: string;
}

export interface PositionsProps {
  mapData: kakaoPlaces[];
}

export interface formatPositions {}

export interface Course {
  courseId: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  courseDays: string;
  likeCount: number;
  places: any;
}
