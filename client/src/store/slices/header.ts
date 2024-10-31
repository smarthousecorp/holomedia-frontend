import {createSlice} from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: "header",
  initialState: {
    isOpen: false,
  },
  reducers: {
    view: (state) => {
      state.isOpen = true;
    },
    hide: (state) => {
      state.isOpen = false;
    },
    setHeaderState: (state, action) => {
      state.isOpen = action.payload; // 외부에서 상태를 설정할 수 있는 리듀서 추가
    },
  },
});

export const {view, hide, setHeaderState} = headerSlice.actions;

export default headerSlice.reducer;
