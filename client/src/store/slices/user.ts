import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    memberNo: localStorage.getItem("member_No") || "0",
  },
  reducers: {
    login: (state, actions) => {
      state.memberNo = actions.payload.memberNo;
    },
    logout: (state) => {
      state.memberNo = "0";
      localStorage.removeItem("member_No");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
