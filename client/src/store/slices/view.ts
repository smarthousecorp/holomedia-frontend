// src/store/slices/view.ts
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ViewMode = "new" | "best" | "weekly";

interface ViewState {
  currentMode: ViewMode;
  currentUploader: string;
  sectionTitle: string;
}

const initialState: ViewState = {
  currentMode: "new",
  currentUploader: "",
  sectionTitle: "최근에 등록된 동영상",
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

      // Update section title based on mode
      switch (action.payload.mode) {
        case "new":
          state.sectionTitle = "최근에 등록된 동영상";
          break;
        case "best":
          state.sectionTitle = "실시간 베스트";
          break;
        case "weekly":
          state.sectionTitle = `${action.payload.uploader}의 동영상`;
          break;
      }
    },
  },
});

export const {setViewMode} = viewSlice.actions;
export default viewSlice.reducer;
