import { Interface } from "readline";

export interface ICourse {
  courseId: number;
  title: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  courseDays: string;
  region: string;
  thumbnailUrl: string;
  content: string;
  likeCount: number;
  isBookmarked: boolean;
  isLiked: boolean;
}

export interface ICoursePlaceName extends ICourse {
  places: string;
}
export interface placesName {
  name: string;
}

export enum ApiStatus {
  "loading",
  "ideal",
  "success",
  "error",
}

export interface ICourseState {
  list: ICourse[];
  listStatus: ApiStatus;
  // createUserFormStatus: ApiStatus;
}

export interface ICourseForm {
  title: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  courseDays: string;
  region: string;
  thumbnailUrl: string;
  content: string;
  likeCount: number;
  isBookmarked: boolean;
  isLiked: boolean;
}
export interface ICourseOriginForm extends ICourseForm {
  places: IPlace[];
}

export interface ICourseEditParam {
  formData: ICourseOriginForm;
  courseId: number;
}

export interface ICourseSubmitForm extends ICourseForm {
  placeIds: number[];
}

export interface ICourseDetail {
  courseId: number;
  title: string;
  content: string;
  nickname: string;
  profileImgUrl: string;
  likeCount: number;
  courseDays: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  region: string;
  isBookmarked: boolean;
  isLiked: boolean;
  isPublished: boolean;
  places: IPlace[];
}

export interface IPlace {
  placeId: number;
  name: string;
  address: string;
  imgUrl: string;
  mapX: string;
  mapY: string;
  rating?: string;
}
export interface IPlacesSearch {
  placeId: number;
  name: string;
  address: string;
  imgUrl: string;
  rating: string;
}

export interface IRecommandCourse {
  courseId: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  region: string;
  courseDays: string;
  likeCount: number;
  isLiked: boolean;
}

export interface IRecommandCourseProps extends IRecommandCourse {
  onUpdateCourse: (updatedCourse: IRecommandCourse) => void;
}

export interface IFormErrors {
  title?: string;
  startDate?: string;
  endDate?: string;
  courseDays?: string;
  places?: string;
  content?: string;
}
