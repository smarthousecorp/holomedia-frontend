import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";
import axios from "axios";

interface AdultVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  isTestMode?: boolean;
}

const AdultVerificationModal: React.FC<AdultVerificationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  isTestMode = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 테스트용 더미 데이터 (테스트 할 때 마다 변경)
  const TEST_AUTH_DATA = {
    success: true,
    enc_data: "1",
    integrity_value: "2=",
    token_version_id: "3",
  };

  const handleVerification = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 디버깅을 위한 로그 추가
      console.log("테스트 모드:", isTestMode);

      // 현재 쿠키 상태 로깅
      console.log("Current cookies:", document.cookie);

      // JAVA 서버 API 요청 전 로깅
      console.log("Sending request to nice API...");
      // JAVA 서버 API
      const authData = isTestMode
        ? TEST_AUTH_DATA
        : await axios
            .post(
              `https://apiholomedia.duckdns.org/nice`,
              {},
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
                // 요청과 응답 인터셉터 추가
                onUploadProgress: (progressEvent) => {
                  console.log("Upload progress:", progressEvent);
                },
              }
            )
            .then((response) => {
              // 응답 헤더 로깅
              console.log("Response headers:", response.headers);
              // 쿠키 확인
              console.log("Cookies after response:", document.cookie);
              return response.data;
            })
            .catch((error) => {
              // 에러 상세 정보 로깅
              console.error("Request failed:", {
                config: error.config,
                response: error.response,
                message: error.message,
              });
              throw error;
            });

      // const authData = isTestMode
      //   ? TEST_AUTH_DATA
      //   : (await api.post(`/api/nice/auth/request`, {})).data;

      // // Store auth data in session storage
      // sessionStorage.setItem("auth_data", JSON.stringify(authData));

      // 응답 데이터 검증
      if (
        !authData.enc_data ||
        !authData.integrity_value ||
        !authData.token_version_id
      ) {
        throw new Error("필수 인증 정보가 누락되었습니다.");
      }

      // if (!authData.success) {
      //   throw new Error(authData.message || "인증 정보 요청 실패");
      // }

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const option = `width=${width},height=${height},left=${left},top=${top},toolbar=no,scrollbars=no,status=no,menubar=no`;

      const popup = window.open("", "nicePopup", option);

      if (!popup) {
        throw new Error("팝업이 차단되었습니다.");
      }

      // // 팝업이 열린 후 메시지 전달
      // popup.postMessage(
      //   {
      //     sessionData: sessionStorage.getItem("auth_data"),
      //   },
      //   "https://nice.checkplus.co.kr"
      // );

      // form 요소 디버깅
      if (!formRef.current) {
        throw new Error("폼 요소를 찾을 수 없습니다.");
      }

      if (formRef.current && authData) {
        const form = formRef.current;
        const { enc_data, integrity_value, token_version_id } = authData;

        // 폼 데이터 설정 전 로그
        console.log("설정할 폼 데이터:", {
          enc_data,
          integrity_value,
          token_version_id,
        });

        // 폼 입력 요소 존재 여부 확인
        const encDataInput = form.querySelector(
          '[name="enc_data"]'
        ) as HTMLInputElement;
        const tokenInput = form.querySelector(
          '[name="token_version_id"]'
        ) as HTMLInputElement;
        const integrityInput = form.querySelector(
          '[name="integrity_value"]'
        ) as HTMLInputElement;

        if (!encDataInput || !tokenInput || !integrityInput) {
          throw new Error("필수 폼 입력 요소가 없습니다.");
        }

        // 폼 데이터 설정
        encDataInput.value = enc_data;
        tokenInput.value = token_version_id;
        integrityInput.value = integrity_value;

        const popupMonitor = setInterval(() => {
          if (popup.closed) {
            clearInterval(popupMonitor);
            window.removeEventListener("message", handleMessage);
            setIsLoading(false);
            onClose(); // 모달 닫기
          }
        }, 500);

        // 메시지 이벤트 리스너 등록
        const handleMessage = async (event: MessageEvent) => {
          // 전체 이벤트 객체 로깅
          if (event.data.source === "react-devtools-bridge") {
            return;
          }
          console.log("수신된 메시지 이벤트:", event);
          console.log("인증 데이터:", event.data);

          try {
            const { success, authStatus, userInfo } = event.data;

            // 인증 상태 로깅
            console.log("인증 성공 여부:", success);
            console.log("인증 상태 코드:", authStatus);
            console.log("사용자 정보:", userInfo);

            if (success && authStatus === "0000") {
              const { data: verifyResult } = await api.post(
                "/api/nice/auth/verify",
                {
                  authStatus,
                  userInfo,
                }
              );

              // 검증 결과 로깅
              console.log("서버 검증 결과:", verifyResult);

              if (verifyResult.success && verifyResult.age >= 19) {
                onComplete();
              } else {
                setError("성인인증에 실패했습니다.");
              }
            } else {
              setError("본인인증에 실패했습니다.");
            }
          } catch (error) {
            console.error("인증 오류:", error);
            setError("인증 처리 중 오류가 발생했습니다.");
          }
        };

        window.addEventListener("message", handleMessage);

        // 폼 제출
        // 팝업 로드 완료 대기

        form.submit();
      }
    } catch (error) {
      setError("본인인증 처리 중 오류가 발생했습니다.");
      console.error("본인인증 처리 중 오류 발생:", error);
      setIsLoading(false);
    }
  }, [onComplete, isTestMode]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>성인인증이 필요한 서비스입니다.</h2>
        <p>서비스 이용을 위해 성인인증이 필요합니다.</p>
        {isTestMode && <TestModeMessage>테스트 모드 활성화됨</TestModeMessage>}
        <form
          ref={formRef}
          id="niceAuthForm"
          name="niceAuthForm"
          method="get"
          target="nicePopup"
          action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
        >
          <input type="hidden" id="m" name="m" value="service" />
          <input
            type="hidden"
            id="token_version_id"
            name="token_version_id"
            value=""
          />
          <input type="hidden" id="enc_data" name="enc_data" value="" />
          <input
            type="hidden"
            id="integrity_value"
            name="integrity_value"
            value=""
          />
        </form>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button onClick={handleVerification} disabled={isLoading}>
            {isLoading ? "처리중..." : "성인인증 하기"}
          </Button>
          <Button onClick={onClose} secondary>
            취소
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

const TestModeMessage = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  color: #ee3453;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 3rem;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;

  h2 {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
    color: #333;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2.5rem;
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button<{ secondary?: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;

  ${(props) =>
    props.secondary
      ? `
    background-color: #e0e0e0;
    color: #333;
  `
      : `
    background-color: #EE3453;
    color: white;
  `}

  &:hover {
    opacity: 0.9;
  }
`;

export default AdultVerificationModal;
