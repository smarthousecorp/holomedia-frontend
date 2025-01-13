import axios from "axios";
import store from "../store";
import { logout } from "../store/slices/user";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  withCredentials: true, // 쿠키를 주고받기 위한 설정
});

// 헤더에는 기본적인 설정만 필요
api.defaults.headers.common["Content-Type"] = "application/json";

// 응답 인터셉터 - 세션 만료 등의 인증 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 인증 에러 발생시
    if (error.response?.status === 401) {
      // Redux 상태 초기화
      store.dispatch(logout());
      // 로그인 페이지로 리다이렉트
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
