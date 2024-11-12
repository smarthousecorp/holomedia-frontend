// src/store/slices/view.ts
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
// import i18n from "../../i18n.js"; // i18n 설정 파일 import

export type ViewMode = "new" | "best" | "weekly";

interface ViewState {
  currentMode: ViewMode;
  currentUploader: string;
}

const initialState: ViewState = {
  currentMode: "new",
  currentUploader: "",
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setViewMode: (
      state,
      action: PayloadAction<{mode: ViewMode; uploader?: string}>
    ) => {
      state.currentMode = action.payload.mode;
      state.currentUploader = action.payload.uploader || "";
    },
  },
});

export const {setViewMode} = viewSlice.actions;
export default viewSlice.reducer;
