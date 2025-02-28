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

      // 모든 요청 취소
      const cancelToken = axios.CancelToken.source();
      api.defaults.cancelToken = cancelToken.token;
      cancelToken.cancel("세션 만료로 인한 모든 요청 취소");

      // 알림 표시와 동시에 리다이렉트
      alert("세션이 만료되어 로그인 페이지로 이동합니다.");
      window.location.href = "/";

      // 이후 코드 실행 방지
      return new Promise(() => {});
    }

    // 502 에러 발생시 (서버가 닫힌 경우)
    if (error.response?.status === 502) {
      // 모든 요청 취소
      const cancelToken = axios.CancelToken.source();
      api.defaults.cancelToken = cancelToken.token;
      cancelToken.cancel("서버 연결 불가로 인한 모든 요청 취소");

      // 알림 표시
      alert("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");

      // 선택적: 홈페이지나 오류 페이지로 리다이렉트
      window.location.href = "/";

      // 이후 코드 실행 방지
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);
