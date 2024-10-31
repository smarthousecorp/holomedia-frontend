import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
import modal from "./slices/modal";
import user from "./slices/user";
import sidebar from "./slices/sidebar";
import {thunk} from "redux-thunk";
// import logger from "redux-logger";
import header from "./slices/header";

const reducers = combineReducers({
  modal: modal,
  user: user,
  sidebar: sidebar,
  header: header,
});

const persistConfig = {
  key: "root",
  storage,
  whiteList: ["user"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
