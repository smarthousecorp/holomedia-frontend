import {createSlice} from "@reduxjs/toolkit";

const user = createSlice({
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
    },
  },
});

export const {login, logout} = user.actions;

export default user.reducer;
