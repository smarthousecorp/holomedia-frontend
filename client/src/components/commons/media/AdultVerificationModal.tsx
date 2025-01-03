import styled from "styled-components";
import { api } from "../../../utils/api";

interface AdultVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const AdultVerificationModal = ({
  isOpen,
  onClose,
  onComplete,
}: AdultVerificationModalProps) => {
  if (!isOpen) return null;

  const handleVerification = async () => {
    try {
      const left = window.screen.width / 2 - 500 / 2;
      const top = window.screen.height / 2 - 800 / 2;
      const option = `status=no, menubar=no, toolbar=no, resizable=no, width=500, height=600, left=${left}, top=${top}`;

      // 1. 백엔드 API를 호출하여 인증 정보 받아오기
      const response = await api.post(
        "/api/nice/auth/request",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const authData = await response.data;
      console.log(authData);

      if (!authData.success) {
        throw new Error(authData.message);
      }

      // 2. 팝업 창 열기
      const popup = window.open("", "nicePopup", option);

      // 3. 폼 생성 및 제출
      const form = document.getElementById("niceAuthForm") as HTMLFormElement;
      if (form && authData) {
        const { enc_data, integrity_value, token_version_id } = authData;
        form.target = "nicePopup";
        (form.querySelector('[name="enc_data"]') as HTMLInputElement).value =
          enc_data;
        (
          form.querySelector('[name="token_version_id"]') as HTMLInputElement
        ).value = token_version_id;
        (
          form.querySelector('[name="integrity_value"]') as HTMLInputElement
        ).value = integrity_value;
        form.submit();
      }

      // 4. 팝업 창 결과 처리
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== "https://nice.checkplus.co.kr") return;

        const { success, data } = event.data;

        if (success) {
          try {
            const verifyResponse = await api.post(
              "/api/nice/auth/verify",
              data
            );
            const verifyResult = await verifyResponse.data;

            if (verifyResult.success) {
              if (verifyResult.age >= 19) {
                onComplete();
              } else {
                alert(
                  "성인인증에 실패했습니다. 만 19세 이상만 이용 가능합니다."
                );
              }
            } else {
              throw new Error(verifyResult.message);
            }
          } catch (error) {
            console.error("인증 확인 중 오류 발생:", error);
            alert("인증 처리 중 오류가 발생했습니다.");
          }
        } else {
          alert("본인인증에 실패했습니다.");
        }

        window.removeEventListener("message", handleMessage);
        popup?.close();
      };

      window.addEventListener("message", handleMessage);
    } catch (error) {
      console.error("본인인증 처리 중 오류 발생:", error);
      alert("본인인증 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>성인인증이 필요한 서비스입니다.</h2>
        <p>서비스 이용을 위해 성인인증이 필요합니다.</p>
        <form
          id="niceAuthForm"
          name="niceAuthForm"
          method="post"
          action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb"
        >
          <input type="hidden" name="m" value="checkplusService" />
          <input type="hidden" name="token_version_id" value="" />
          <input type="hidden" name="enc_data" value="" />
          <input type="hidden" name="integrity_value" value="" />
        </form>
        <ButtonGroup>
          <Button onClick={handleVerification}>성인인증 하기</Button>
          <Button onClick={onClose} secondary>
            취소
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

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
