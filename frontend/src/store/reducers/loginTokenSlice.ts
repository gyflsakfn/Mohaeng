import { createSlice } from "@reduxjs/toolkit";

export interface LoginState {
  // isLoading: string;
  // isLoggedin: boolean;

  id: number | null;
  token: string;
  nickName: string;
  email: string;
  imgUrl: string;
}

const initialState: LoginState = {
  // isLoading: "loading",
  // isLoggedin: false,
  id: null,
  token: "",
  nickName: "",
  email: "",
  imgUrl: "",
};

export const logintokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setNickname: (state, action) => {
      state.nickName = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setImgUrl: (state, action) => {
      state.imgUrl = action.payload;
    },
    resetLog: (state) => {
      state.id = null;
      state.token = "";
      state.nickName = "";
      state.email = "";
      state.imgUrl = "";
    },
  },
});

export const { setToken, setNickname, setEmail, setId, setImgUrl, resetLog } =
  logintokenSlice.actions;
export default logintokenSlice.reducer;
