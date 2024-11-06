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

  const handleVerification = () => {
    // 성인인증 로직 구현
    // 예: 본인인증 서비스 연동
    // 성공 시 onComplete 호출
    onComplete();
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
