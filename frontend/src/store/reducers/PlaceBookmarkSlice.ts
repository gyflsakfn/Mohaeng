import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface bookmarkPlace {
  bookMarkId: number;
  placeId: number;
  contendId: string;
  placeName: string;
  rating: number;
  address: string;
  content: string;
  imgUrl: string;
  createdDate: string;
  modifiedDate: string;
}

export interface bookmarkPlaceState {
  data: bookmarkPlace[];
}

const initialState: bookmarkPlaceState = {
  data: [],
};

export const getPlaceBookmark = createAsyncThunk(
  "mypage/placebookmark",
  async (token: string) => {
    const response = await axios.get(`/api/myPage/place/bookMark`, {
      headers: {
        "Access-Token": token,
      },
      withCredentials: true,
    });
    return response.data.data;
  }
);

export const PlaceBookmarkSlice = createSlice({
  name: "placeBookmark",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPlaceBookmark.pending, (state) => {
    });
    builder.addCase(getPlaceBookmark.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(getPlaceBookmark.rejected, (state) => {
    });
  },
});

export default PlaceBookmarkSlice.reducer;
