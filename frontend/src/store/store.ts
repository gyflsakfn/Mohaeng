import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import modalReducer from "./reducers/modalSlice";
import tokenReducer from "./reducers/loginTokenSlice";
import nickNameReducer from "./reducers/loginTokenSlice";
import emailReducer from "./reducers/loginTokenSlice";
import idReducer from "./reducers/loginTokenSlice";
import imgUrlReducer from "./reducers/loginTokenSlice";
import placeReducer from "./reducers/PlaceSlice";
import mypageReducer from "./reducers/mypageSlice";
import pageReducer from "./reducers/pageSlice";
import searchPlaceReducer from "./reducers/searchPlaceSlice";
import searchCourseReducer from "./reducers/searchCourseSlice";
import placeBookmarkReducer from "./reducers/PlaceBookmarkSlice";
import reviewDetailReducer from "./reducers/reviewDetailSlice";
import reviewReducer from "./reducers/reviewSlice";
import myCourseReducer from "./reducers/myCourseSlice";
import myReviewReducer from "./reducers/myReviewSlice";
import FilterSlice from "./reducers/FilterSlice";
import CourseBookmarkReducer from "./reducers/CourseBoomarkSlice";
import CourseDetailSlice from "./reducers/CourseDetailSlice";
import CourseListSlice from "./reducers/CourseListSlice";
import CourseFormSlice from "./reducers/CourseFormSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    token: tokenReducer,
    nickName: nickNameReducer,
    email: emailReducer,
    id: idReducer,
    imgUrl: imgUrlReducer,
    course: CourseListSlice,
    courseForm: CourseFormSlice,
    filter: FilterSlice,
    place: placeReducer,
    mypage: mypageReducer,
    page: pageReducer,
    searchPlace: searchPlaceReducer,
    searchCourse: searchCourseReducer,
    courseBookmark: CourseBookmarkReducer,
    placeBookmark: placeBookmarkReducer,
    reviewDetail: reviewDetailReducer,
    review: reviewReducer,
    myCourse: myCourseReducer,
    courseDetail: CourseDetailSlice,
    myReview: myReviewReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
