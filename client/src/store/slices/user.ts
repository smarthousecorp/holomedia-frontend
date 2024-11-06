import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    username: "",
    is_adult_verified: 0,
  },
  reducers: {
    login: (state, actions) => {
      state.isLoggedIn = true;
      state.username = actions.payload.username;
      state.is_adult_verified = actions.payload.is_adult_verified;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = "";
      state.is_adult_verified = 0;
    },
    verifyAdult: (state) => {
      state.is_adult_verified = 1; // 성인 인증 완료
    },
  },
});

export const {login, logout, verifyAdult} = userSlice.actions;

export default userSlice.reducer;
