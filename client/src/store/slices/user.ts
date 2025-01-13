import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    id: "",
    username: "",
    profile_image: "",
    background_image: "",
    is_adult_verified: 0,
    is_admin: 0,
    is_uploader: 0,
    bloom: 0,
  },
  reducers: {
    login: (state, actions) => {
      state.isLoggedIn = true;
      state.id = actions.payload.id;
      state.username = actions.payload.username;
      state.profile_image = actions.payload.profile_image;
      state.background_image = actions.payload.background_image;
      state.is_adult_verified = actions.payload.is_adult_verified;
      state.is_admin = actions.payload.is_admin;
      state.is_uploader = actions.payload.is_uploader;
      state.bloom = actions.payload.bloom;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.id = "";
      state.username = "";
      state.profile_image = "";
      state.background_image = "";
      state.is_adult_verified = 0;
      state.is_admin = 0;
      state.is_uploader = 0;
      state.bloom = 0;
    },
    verifyAdult: (state) => {
      state.is_adult_verified = 1; // 성인 인증 완료
    },
  },
});

export const { login, logout, verifyAdult } = userSlice.actions;

export default userSlice.reducer;
