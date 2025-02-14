import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import modal from "./slices/modal";
import user from "./slices/user";
import sidebar from "./slices/sidebar";
import { thunk } from "redux-thunk";
import header from "./slices/header";
import toast from "./slices/toast";

const reducers = combineReducers({
  modal: modal,
  user: user,
  sidebar: sidebar,
  header: header,
  toast: toast,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 무시할 액션 타입
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
