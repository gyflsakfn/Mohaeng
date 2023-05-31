import { IFormErrors, IPlace } from "../../interfaces/Course.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICourseForm, ICourseOriginForm } from "../../interfaces/Course.type";
import { createCourseAction } from "../thunks/courseThunks";

interface CourseState {
  errors?: IFormErrors;
  isFormValid: boolean;
  course: ICourseOriginForm;
}

export const initialState: CourseState = {
  course: {
    title: "",
    content: "",
    courseDays: "",
    startDate: "",
    endDate: "",
    region: "",
    isPublished: true,
    thumbnailUrl: "",
    places: [],
    isBookmarked: false,
    isLiked: false,
    likeCount: 0,
  },
  isFormValid: false,
};

export const CourseFormSlice = createSlice({
  name: "courseform",
  initialState: initialState,
  reducers: {
    setFormValue: (
      state,
      action: PayloadAction<{
        name: keyof ICourseForm;
        value: string | boolean;
      }>
    ) => {
      const { name, value } = action.payload;
      state.course = {
        ...state.course,
        [name]: value,
      };
    },
    removePlace: (state, action) => {
      const newList = state.course.places.filter(
        (place) => place.placeId !== action.payload
      );
      state.course.places = newList;
    },
    updatePlaces: (state, action: PayloadAction<IPlace[]>) => {
      state.course.places = action.payload;
    },
    resetFormValue: () => {
      return initialState;
    },
    addPlaceObject: (state, action) => {
      const data = action.payload;

      const placeIds = new Set(
        state.course.places.map((place) => place.placeId)
      );
      if (placeIds.has(data.placeId)) {
        window.alert("이미 추가된 장소입니다.");
        // 이미 같은 placeId를 가진 객체가 존재하므로 추가하지 않음
        return;
      }

      state.course.places.push(data);
    },
    addFormValue: (state, action) => {
      state.course = action.payload;
    },
    setIsFormValidTrue(state) {
      state.isFormValid = true;
    },
    setIsFormValidFalse(state) {
      state.isFormValid = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCourseAction.pending, (state) => {
      // state.createUserFormStatus = ApiStatus.loading;
    });
    builder.addCase(createCourseAction.fulfilled, (state, action) => {
      // state.createUserFormStatus = ApiStatus.success;
    });
    builder.addCase(createCourseAction.rejected, (state) => {
      // state.createUserFormStatus = ApiStatus.error;
    });
  },
});

export const {
  setFormValue,
  resetFormValue,
  updatePlaces,
  addPlaceObject,
  removePlace,
  addFormValue,
  setIsFormValidTrue,
  setIsFormValidFalse,
} = CourseFormSlice.actions;
export default CourseFormSlice.reducer;
