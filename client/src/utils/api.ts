import axios from "axios";
import { getCookie, removeCookie } from "./cookie";
import store from "../store";
import { logout } from "../store/slices/user";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// 요청이 전송되기 전 실행할 로직
api.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `${accessToken}`;
    }
    return config;
  },
  async (error) => {
    await Promise.reject(error);
  }
);

// 서버로부터 응답 받은 뒤 실행할 로직
api.interceptors.response.use(
  (response) => {
    // 2xx 응답코드에 대한 트리거
    return response;
  },
  async (error) => {
    // 2xx이 아닌 응답코드에 대한 트리거
    // const {response: errorResponse} = error;

    // 인증 에러 발생시 (refreshToken 발급 시 주석 해제 및 로직 작성)
    // if (errorResponse.status === 401) {
    //   return await resetTokenAndReattemptRequest(error);
    // }
    if (error.response.status === 401) {
      localStorage.removeItem("accessToken");
      removeCookie("accessToken");
      store.dispatch(logout());
      window.location.href = "/";
    }
    return await Promise.reject(error);
  }
);
