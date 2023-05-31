import { ICourseDetail } from "@/src/interfaces/Course.type";
import { createSlice } from "@reduxjs/toolkit";
import {
  bookmarkToggleAction,
  getCourseDetailAction,
  likeToggleAction,
} from "../thunks/courseThunks";

interface CourseDetailState {
  error?: string;
  course: ICourseDetail;
}

const initialState: CourseDetailState = {
  course: {
    courseId: 0,
    title: "",
    content: "",
    nickname: "",
    profileImgUrl: "",
    likeCount: 0,
    courseDays: "",
    createdDate: "",
    startDate: "",
    endDate: "",
    region: "",
    isBookmarked: false,
    isLiked: true,
    isPublished: true,
    places: [],
  },
};

export const CourseDetailSlice = createSlice({
  name: "coursedetail",
  initialState: initialState,
  reducers: {
    resetCourseDetail: (state) => {
      state.course = { ...initialState.course };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCourseDetailAction.pending, (state) => {});
    builder.addCase(getCourseDetailAction.fulfilled, (state, action) => {
      const course = action.payload;
      state.course = course;
    });
    builder.addCase(getCourseDetailAction.rejected, (state) => {});
    builder.addCase(bookmarkToggleAction.pending, (state) => {});
    builder.addCase(bookmarkToggleAction.fulfilled, (state, action) => {
      const { courseId, isDetailPage } = action.payload;
      if (!isDetailPage || isDetailPage === undefined) return;
      if (state.course.courseId === courseId) {
        state.course.isBookmarked = !state.course.isBookmarked;
      } else return;
    });
    builder.addCase(bookmarkToggleAction.rejected, (state) => {});
    builder.addCase(likeToggleAction.pending, (state) => {});
    builder.addCase(likeToggleAction.fulfilled, (state, action) => {
      const { courseId, totalLikes, isDetailPage } = action.payload;
      if (!isDetailPage || isDetailPage === undefined) return state;
      if (state.course.courseId === courseId) {
        return {
          ...state,
          course: {
            ...state.course,
            isLiked: !state.course.isLiked,
            likeCount: totalLikes,
          },
        };
      } else {
        return state;
      }
    });
    builder.addCase(likeToggleAction.rejected, (state) => {});
  },
});

export const { resetCourseDetail } = CourseDetailSlice.actions;
export default CourseDetailSlice.reducer;
