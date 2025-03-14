import axios from "axios";
import store from "../store";
import { logout } from "../store/slices/user";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  withCredentials: true, // 쿠키를 주고받기 위한 설정
});

// 헤더에는 기본적인 설정만 필요
api.defaults.headers.common["Content-Type"] = "application/json";

// 상태 변수로 모달 표시 여부를 관리
let isServerErrorModalShown = false;

// 서버 에러 모달 표시 함수
const showServerErrorModal = (message: string) => {
  // 모달이 이미 표시되었다면 중복 표시 방지
  if (isServerErrorModalShown) return;

  isServerErrorModalShown = true;

  // alert() 대신 커스텀 모달을 사용할 수 있습니다
  // 예시로는 alert를 사용합니다
  alert(message);

  // 모달 닫힘 처리
  setTimeout(() => {
    isServerErrorModalShown = false;
  }, 3000);
};

// 에러 페이지로 리다이렉트하는 함수
const redirectToErrorPage = (errorType: string) => {
  // 에러 타입을 쿼리 파라미터로 전달
  window.location.href = `/error?type=${errorType}`;
};

// 응답 인터셉터 - 세션 만료 등의 인증 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("요청 후 응답 에러", error);

    // CORS 에러 감지
    if (error.message === "Network Error" || error.message.includes("CORS")) {
      // 모든 요청 취소
      const cancelToken = axios.CancelToken.source();
      api.defaults.cancelToken = cancelToken.token;
      cancelToken.cancel("CORS 에러로 인한 모든 요청 취소");

      // 에러 페이지로 리다이렉트
      redirectToErrorPage("network");

      // 이후 코드 실행 방지
      return new Promise(() => {});
    }

    // 인증 에러 발생시
    if (error.response?.status === 401) {
      // Redux 상태 초기화
      store.dispatch(logout());

      // 모든 요청 취소
      const cancelToken = axios.CancelToken.source();
      api.defaults.cancelToken = cancelToken.token;
      cancelToken.cancel("세션 만료로 인한 모든 요청 취소");

      // 알림 표시와 동시에 리다이렉트
      showServerErrorModal("세션이 만료되어 로그인 페이지로 이동합니다.");
      window.location.href = "/";

      // 이후 코드 실행 방지
      return new Promise(() => {});
    }

    // 502 에러 발생시 (서버 점검 상태)
    if (error.response?.status === 502) {
      // 모든 요청 취소
      const cancelToken = axios.CancelToken.source();
      api.defaults.cancelToken = cancelToken.token;
      cancelToken.cancel("서버 연결 불가로 인한 모든 요청 취소");

      // 에러 페이지로 리다이렉트
      redirectToErrorPage("server");

      // 이후 코드 실행 방지
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);
