import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { VerificationData } from "../../types/nice";

interface NiceVerificationProps {
  onVerificationComplete: (data: VerificationData) => void;
  onError: (message: string) => void;
}

const NiceVerificationButton: React.FC<NiceVerificationProps> = ({
  onVerificationComplete,
  onError,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleVerification = useCallback(async () => {
    setIsVerifying(true);

    try {
      const { data: authData } = await axios.get(
        `https://api.holomedia.co.kr/nice`,
        {
          params: { type: 1 },
          withCredentials: true,
        }
      );

      if (
        !authData.data.enc_data ||
        !authData.data.integrity_value ||
        !authData.data.token_version_id
      ) {
        throw new Error("필수 인증 정보가 누락되었습니다.");
      }

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(
        "",
        "nicePopup",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,scrollbars=no,status=no,menubar=no`
      );

      if (!popup) {
        throw new Error("팝업이 차단되었습니다.");
      }

      if (!formRef.current) {
        throw new Error("폼 요소를 찾을 수 없습니다.");
      }

      const form = formRef.current;
      const { enc_data, integrity_value, token_version_id } = authData.data;

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

      const popupMonitor = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupMonitor);
          window.removeEventListener("message", handleMessage);
          setIsVerifying(false);
        }
      }, 500);

      const handleMessage = async (event: MessageEvent) => {
        if (event.data.source === "react-devtools-bridge") return;

        try {
          const { success, authStatus, userInfo } = event.data;

          console.log("본인인증 이후 데이터", event.data);

          if (success && authStatus === "0000") {
            setIsVerified(true);
            console.log("성공 시 유저정보", userInfo);
          }
        } catch (error) {
          console.error("인증 오류:", error);
          onError("인증 처리 중 오류가 발생했습니다.");
        }
      };

      window.addEventListener("message", handleMessage);
      form.submit();
    } catch (error) {
      console.error("본인인증 처리 중 오류 발생:", error);
      onError("본인인증 처리 중 오류가 발생했습니다.");
      setIsVerifying(false);
    }
  }, [onVerificationComplete, onError]);

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
  width: auto;
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
