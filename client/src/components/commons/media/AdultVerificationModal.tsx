import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";

interface AuthResponse {
  success: boolean;
  message?: string;
  enc_data?: string;
  integrity_value?: string;
  token_version_id?: string;
}

interface VerifyResponse {
  success: boolean;
  message?: string;
  age?: number;
}

interface AdultVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const AdultVerificationModal: React.FC<AdultVerificationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleVerification = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 팝업 창 위치 계산
      const left = window.screen.width / 2 - 500 / 2;
      const top = window.screen.height / 2 - 800 / 2;
      const popupOptions = `status=no, menubar=no, toolbar=no, resizable=no, width=500, height=600, left=${left}, top=${top}`;

      // 1. 인증 정보 요청
      const { data: authData } = await api.post<AuthResponse>(
        "/api/nice/auth/request"
      );

      console.log(authData);

      if (!authData.success) {
        throw new Error(authData.message || "인증 정보 요청 실패");
      }

      // 2. 팝업 창 열기
      popupRef.current = window.open("", "nicePopup", popupOptions);

      // 3. 폼 데이터 설정 및 제출
      if (formRef.current && authData) {
        const form = formRef.current;
        const { enc_data, integrity_value, token_version_id } = authData;

        (form.querySelector('[name="enc_data"]') as HTMLInputElement).value =
          enc_data || "";
        (
          form.querySelector('[name="token_version_id"]') as HTMLInputElement
        ).value = token_version_id || "";
        (
          form.querySelector('[name="integrity_value"]') as HTMLInputElement
        ).value = integrity_value || "";

        form.submit();
      }

      // 4. 팝업 창 결과 처리
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== "https://nice.checkplus.co.kr") return;

        try {
          const { success, data } = event.data;

          if (success) {
            const { data: verifyResult } = await api.post<VerifyResponse>(
              "/api/nice/auth/verify",
              data
            );

            if (
              verifyResult.success &&
              verifyResult.age &&
              verifyResult.age >= 19
            ) {
              onComplete();
            } else {
              setError(
                "성인인증에 실패했습니다. 만 19세 이상만 이용 가능합니다."
              );
            }
          } else {
            setError("본인인증에 실패했습니다.");
          }
        } catch (error) {
          setError("인증 처리 중 오류가 발생했습니다.");
          console.error("인증 확인 중 오류 발생:", error);
        } finally {
          window.removeEventListener("message", handleMessage);
          popupRef.current?.close();
          setIsLoading(false);
        }
      };

      window.addEventListener("message", handleMessage);
    } catch (error) {
      setError("본인인증 처리 중 오류가 발생했습니다.");
      console.error("본인인증 처리 중 오류 발생:", error);
      setIsLoading(false);
    }
  }, [onComplete]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>성인인증이 필요한 서비스입니다.</h2>
        <p>서비스 이용을 위해 성인인증이 필요합니다.</p>

        <form
          ref={formRef}
          id="niceAuthForm"
          name="niceAuthForm"
          method="post"
          target="nicePopup"
          action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb"
        >
          <input type="hidden" name="m" value="checkplusService" />
          <input type="hidden" name="token_version_id" value="" />
          <input type="hidden" name="enc_data" value="" />
          <input type="hidden" name="integrity_value" value="" />
        </form>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button onClick={handleVerification} disabled={isLoading}>
            {isLoading ? "처리중..." : "성인인증 하기"}
          </Button>
          <Button onClick={onClose} secondary disabled={isLoading}>
            취소
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

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
