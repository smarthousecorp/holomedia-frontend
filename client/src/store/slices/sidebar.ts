import {createSlice} from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isOpen: false,
  },
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    setSidebarState: (state, action) => {
      state.isOpen = action.payload; // 외부에서 상태를 설정할 수 있는 리듀서 추가
    },
  },
});

export const {open, close, setSidebarState} = sidebarSlice.actions;

export default sidebarSlice.reducer;
