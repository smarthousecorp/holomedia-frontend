import styled from "styled-components";

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

  // 성인인증하기 버튼 실행 함수
  const handleVerification = async () => {
    try {
      // 1. 백엔드 API를 호출하여 인증 정보 받아오기
      const response = await fetch("/api/nice/auth/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const authData = await response.json();

      if (!authData.success) {
        throw new Error(authData.message);
      }

      // 2. 팝업 창 설정
      const popupWidth = 500;
      const popupHeight = 700;
      const left = (window.screen.width - popupWidth) / 2;
      const top = (window.screen.height - popupHeight) / 2;

      // 3. 팝업 창 열기
      const popup = window.open(
        "",
        "niceAuth",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes`
      );

      // 4. 폼 생성 및 제출
      const form = document.createElement("form");
      form.name = "niceAuthForm";
      form.method = "post";
      form.action =
        "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
      form.target = "niceAuth";

      // 받아온 인증 데이터를 hidden input으로 추가
      const appendInput = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      // 필요한 파라미터들 추가
      appendInput("m", "checkplusService"); // 필수 항목
      appendInput("token_version_id", authData.token_version_id);
      appendInput("enc_data", authData.enc_data);
      appendInput("integrity_value", authData.integrity_value);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // 5. 팝업 창 결과 처리
      const handleMessage = async (event: any) => {
        // NICE 인증서버의 도메인 체크 (보안)
        if (event.origin !== "https://nice.checkplus.co.kr") return;

        const {success, data} = event.data;

        if (success) {
          try {
            // 백엔드로 인증 결과 전송
            const verifyResponse = await fetch("/api/nice/auth/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              // 성인인증 성공 처리
              if (verifyResult.age >= 19) {
                onComplete(); // 성공 콜백 실행
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

        // 이벤트 리스너 제거 및 팝업 창 닫기
        window.removeEventListener("message", handleMessage);
        popup?.close();
      };

      // 팝업 창으로부터의 메시지 수신 대기
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

const Button = styled.button<{secondary?: boolean}>`
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
