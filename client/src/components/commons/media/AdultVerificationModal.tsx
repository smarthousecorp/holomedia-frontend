import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";

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
  const popupRef = useRef<Window | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 테스트용 더미 데이터
  const TEST_AUTH_DATA = {
    success: true,
    enc_data:
      "Wy0xLCAtNjEsIC01MCwgNSwgLTMsIDE2LCAtNjMsIC02LCA4NSwgLTI3LCAtNzgsIC0yMCwgMTMsIC03MiwgMzAsIDk0LCAtMTI0LCAxMjAsIC04MCwgLTgwLCAtOTksIC02NywgNzcsIC0zMCwgLTEwMywgNTYsIC00NSwgNzcsIC00NCwgLTQxLCAtODgsIDE3LCA1MywgMTI3LCAyNiwgLTEwMCwgODUsIC00NiwgMzAsIC0xMiwgLTE3LCA0NSwgOTUsIDEwNiwgNzYsIDEzLCAtNzcsIC0yLCAyNCwgMTIzLCAzMywgNzAsIC05NSwgNTcsIDE3LCAtMTI3LCA0NSwgLTk2LCAxMTcsIDUyLCA1MCwgMjMsIC0yOCwgMTIyLCAtMTAsIDM5LCAtMzIsIC02NSwgLTEsIDI2LCAtNDMsIC02OCwgLTEwMiwgNjYsIDQwLCAyMSwgLTEwNCwgLTQ5LCAtMzksIDcwLCA4MywgLTI0LCAtNTEsIC03OSwgMzAsIDU3LCA4NiwgMTE3LCAxMjYsIC02NiwgODQsIDgzLCAtNDMsIC04MSwgLTU1LCA4NSwgODEsIC0zMCwgNSwgMTYsIDExLCAtMTE0LCAtMTI0LCA4MSwgLTI4LCAtMTExLCA2NSwgLTEyNywgODQsIC0yLCAtNDUsIDExMiwgLTgsIC0xMDcsIC03MiwgLTQ3LCAtNTgsIDY4LCA2OCwgNDcsIDU4LCAtNjIsIDEwLCAtNTcsIDEyNCwgLTY5LCAzNSwgLTU3",
    integrity_value:
      "WzEwLCAxLCAtNjAsIC05NiwgLTQ2LCAxMjAsIDY1LCAxMDYsIDEyNiwgLTYzLCAtOSwgLTQsIC05LCAtNjgsIC00NywgODQsIDQxLCAtNTQsIDcwLCAtMTIsIDc1LCA4LCAtMjMsIDEwNiwgLTEwOSwgMTA5LCAtMTIzLCAtOSwgNjksIDY2LCAtNTYsIC02OV0=",
    token_version_id: "202501031709094C-NCE5CF213-D13AC-38F3DH1C88",
  };

  const handleVerification = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 실제 인증 로직
      const left = window.screen.width / 2 - 500 / 2;
      const top = window.screen.height / 2 - 800 / 2;
      const popupOptions = `status=no, menubar=no, toolbar=no, resizable=no, width=500, height=600, left=${left}, top=${top}`;

      // API 호출 또는 테스트 데이터 사용
      const authData = isTestMode
        ? TEST_AUTH_DATA
        : (await api.post("/api/nice/auth/request")).data;

      if (!authData.success) {
        throw new Error(authData.message || "인증 정보 요청 실패");
      }

      popupRef.current = window.open("", "nicePopup", popupOptions);

      if (formRef.current && authData) {
        const form = formRef.current;
        const { enc_data, integrity_value, token_version_id } = authData;

        // URL 인코딩 적용
        (form.querySelector('[name="enc_data"]') as HTMLInputElement).value =
          encodeURIComponent(enc_data);
        (
          form.querySelector('[name="token_version_id"]') as HTMLInputElement
        ).value = token_version_id;
        (
          form.querySelector('[name="integrity_value"]') as HTMLInputElement
        ).value = encodeURIComponent(integrity_value);

        console.log("인코딩된 폼 데이터:", {
          enc_data: encodeURIComponent(enc_data),
          token_version_id,
          integrity_value: encodeURIComponent(integrity_value),
        });

        form.submit();
      }

      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== "https://nice.checkplus.co.kr") return;

        try {
          const { success, data } = event.data;

          if (success) {
            const { data: verifyResult } = await api.post(
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
          method="post"
          target="nicePopup"
          action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb"
        >
          <input type="hidden" id="m" name="m" value="checkplusService" />
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
