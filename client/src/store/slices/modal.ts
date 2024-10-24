import {createSlice} from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    loginModal: false,
  },
  reducers: {
    on: (state) => {
      state.loginModal = true;
    },
    off: (state) => {
      state.loginModal = false;
    },
  },
});

export const {on, off} = modalSlice.actions;

export default modalSlice.reducer;
