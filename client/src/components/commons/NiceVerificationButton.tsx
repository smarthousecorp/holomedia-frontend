import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { VerificationData } from "../../types/nice";
import { FoundIds } from "../../pages/FindAccount";

interface ApiResponse {
  code: number;
  message: string;
  data: VerificationData & FoundIds;
  timestamp: string;
}

interface NiceVerificationProps {
  onVerificationComplete: (data: VerificationData) => void;
  onError: (message: string) => void;
  verificationType: "signup" | "id" | "password";
  returnUrl?: string; // 각 인증 타입별 리턴 URL 경로
}

const NiceVerificationButton: React.FC<NiceVerificationProps> = ({
  onVerificationComplete,
  onError,
  verificationType,
  returnUrl = `${import.meta.env.VITE_CLIENT_DOMAIN}`,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const popupRef = useRef<Window | null>(null);

  // postMessage 이벤트 핸들러
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // 신뢰할 수 있는 출처인지 확인
      console.log("Received message:", event.data);
      console.log("Origin:", event.origin);

      const allowedOrigins = [
        "https://api.holomedia.co.kr",
        "https://dev.holomedia.co.kr",
        "http://localhost:5173",
        "https://nice.checkplus.co.kr",
      ];
      if (!allowedOrigins.includes(event.origin)) {
        console.log("Unauthorized origin:", event.origin);
        return;
      }

      try {
        const responseData = event.data as ApiResponse;

        if (responseData.code === 0) {
          console.log("인증 성공!", responseData);
          setIsVerified(true);

          // verificationType에 따라 다른 처리
          if (verificationType === "id") {
            console.log("id일 때 responseData 처리", responseData.data);
            // 아이디 찾기의 경우 foundIds 확인
            if (responseData.data.foundIds) {
              onVerificationComplete(responseData.data);
            } else {
              console.error("아이디 찾기 결과가 없습니다.");
              onError("아이디를 찾을 수 없습니다.");
            }
          } else {
            // 다른 인증 타입의 경우 기존처럼 처리
            onVerificationComplete(responseData.data);
          }

          if (popupRef.current) {
            popupRef.current.close();
          }
        } else {
          throw new Error(responseData.message);
        }
      } catch (error) {
        console.error("인증 데이터 처리 중 오류:", error);
        onError("인증 처리 중 오류가 발생했습니다.");
      } finally {
        setIsVerifying(false);
        window.removeEventListener("message", handleMessage);
      }
    },
    [onVerificationComplete, onError]
  );

  const handleVerification = useCallback(async () => {
    setIsVerifying(true);
    console.log("=== 본인인증 시작 ===");

    try {
      const { data: authData } = await axios.get(
        `https://api.holomedia.co.kr/nice`,
        {
          params: {
            type: verificationType,
            returnUrl,
          },
          withCredentials: true,
        }
      );

      console.log("인증 초기 데이터 받음:", authData);

      if (
        !authData.data.enc_data ||
        !authData.data.integrity_value ||
        !authData.data.token_version_id
      ) {
        throw new Error("필수 인증 정보가 누락되었습니다.");
      }

      // postMessage 이벤트 리스너 등록
      window.addEventListener("message", handleMessage, false);

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      console.log("팝업 창 여는 중...");
      const popup = window.open(
        "",
        "nicePopup",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,scrollbars=no,status=no,menubar=no`
      );

      if (!popup) {
        throw new Error("팝업이 차단되었습니다.");
      }

      popupRef.current = popup;
      console.log("팝업 창 열림");

      if (!formRef.current) {
        throw new Error("폼 요소를 찾을 수 없습니다.");
      }

      const form = formRef.current;
      const { enc_data, integrity_value, token_version_id } = authData.data;

      // 폼 데이터 설정
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

      encDataInput.value = enc_data;
      tokenInput.value = token_version_id;
      integrityInput.value = integrity_value;

      console.log("폼 데이터 설정 완료");

      // 팝업 모니터링 (닫힘 감지용)
      const popupMonitor = setInterval(() => {
        if (popup.closed) {
          console.log("팝업 창이 닫힘 감지");
          clearInterval(popupMonitor);
          setIsVerifying(false);
          window.removeEventListener("message", handleMessage);

          // 인증이 완료되지 않은 상태에서 팝업이 닫혔다면 에러 처리
          if (!isVerified) {
            onError("인증이 완료되지 않았습니다.");
          }
        }
      }, 500);

      console.log("폼 제출 시작...");
      form.submit();
      console.log("폼 제출 완료");
    } catch (error) {
      console.error("본인인증 처리 중 오류 발생:", error);
      onError("본인인증 처리 중 오류가 발생했습니다.");
      setIsVerifying(false);
      window.removeEventListener("message", handleMessage);
    }
  }, [onVerificationComplete, onError, handleMessage]);

  return (
    <>
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

      <VerificationButton
        type="button"
        onClick={handleVerification}
        disabled={isVerifying || isVerified}
      >
        {isVerifying ? "인증 처리중..." : isVerified ? "인증완료" : "본인인증"}
        <VerificationStatus verified={isVerified}>
          {isVerified && "✓"}
        </VerificationStatus>
      </VerificationButton>
    </>
  );
};

const VerificationButton = styled.button<{ disabled?: boolean }>`
  background-color: white;
  color: ${(props) => (props.disabled ? "#cccccc" : "#eb3553")};
  border: 2px solid ${(props) => (props.disabled ? "#cccccc" : "#eb3553")};
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  width: 100%;
  min-width: 100px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #eb3553;
    color: white;
  }

  &:disabled {
    border-color: #cccccc;
    cursor: not-allowed;
  }
`;

const VerificationStatus = styled.span<{ verified: boolean }>`
  margin-left: 8px;
  color: ${(props) => (props.verified ? "#4CAF50" : "#cccccc")};
`;

export default NiceVerificationButton;
