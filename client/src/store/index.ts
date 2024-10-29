import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
import modal from "./slices/modal";
import user from "./slices/user";
import {thunk} from "redux-thunk";
import logger from "redux-logger";

const reducers = combineReducers({
  modal: modal,
  user: user,
});

const persistConfig = {
  key: "root",
  storage,
  whiteList: ["user"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk, logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
