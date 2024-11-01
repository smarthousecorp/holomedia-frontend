import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    username: "",
  },
  reducers: {
    login: (state, actions) => {
      state.isLoggedIn = true;
      state.username = actions.payload.username;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = "";
    },
  },
});

export const {login, logout} = userSlice.actions;

export default userSlice.reducer;
