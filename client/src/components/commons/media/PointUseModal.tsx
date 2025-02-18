import React, { useState } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface Creator {
  nickname: string;
}

interface Board {
  point: number;
  title: string;
  urls: {
    video: string;
  };
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board;
  creator: Creator;
  onPaymentComplete: () => void;
}

interface PaymentResult {
  success: boolean;
  message: string;
}

interface ApiResponse {
  code: number;
  message?: string;
  data?: any;
}

const PointUseModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  board,
  creator,
  onPaymentComplete,
}) => {
  const memberNo = useSelector((state: RootState) => state.user.memberNo);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult>({
    success: false,
    message: "",
  });

  const handlePayment = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post<ApiResponse>("/point/use", {
        memberNo: memberNo || localStorage.getItem("memberNo"),
        pointAmount: board.point,
        creatorNickname: creator.nickname,
        fileName: board.title,
        useType: 1,
        memo: `${creator.nickname}님의 영상 콘텐츠 구매`,
      });

      console.log(response);

      if (response.data.code === 0) {
        setPaymentResult({
          success: true,
          message: "결제가 완료되었습니다.",
        });
        onPaymentComplete();
      } else {
        setPaymentResult({
          success: false,
          message: response.data.message || "결제 처리 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      console.log(error);

      setPaymentResult({
        success: false,
        message: "네트워크 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
      setShowResult(true);
    }
  };

  if (!isOpen && !showResult) return null;

  return (
    <>
      {isOpen && (
        <DialogOverlay onClick={onClose}>
          <DialogContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <DialogTitle>콘텐츠 구매</DialogTitle>
            <ContentContainer>
              <Section>
                <SectionTitle>구매하실 콘텐츠</SectionTitle>
                <SectionContent>{creator.nickname}님의 영상</SectionContent>
              </Section>
              <Section>
                <SectionTitle>필요한 포인트</SectionTitle>
                <SectionContent>{board.point}꿀</SectionContent>
              </Section>
              <ButtonContainer>
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button onClick={handlePayment} disabled={isLoading}>
                  {isLoading ? "처리중..." : "구매하기"}
                </Button>
              </ButtonContainer>
            </ContentContainer>
          </DialogContent>
        </DialogOverlay>
      )}

      {showResult && (
        <DialogOverlay onClick={() => setShowResult(false)}>
          <AlertDialogContent
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <AlertDialogTitle success={paymentResult.success}>
              {paymentResult.success ? "결제 완료" : "결제 실패"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {paymentResult.message}
            </AlertDialogDescription>
            <ButtonContainer>
              <Button
                onClick={() => {
                  setShowResult(false);
                  if (paymentResult.success) {
                    onClose();
                  }
                }}
              >
                확인
              </Button>
            </ButtonContainer>
          </AlertDialogContent>
        </DialogOverlay>
      )}
    </>
  );
};

export default PointUseModal;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const DialogContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 425px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DialogTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ContentContainer = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
`;

const SectionContent = styled.p`
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "default";
}

const Button = styled.button<ButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "outline"
      ? `
    background-color: white;
    border: 1px solid #e2e8f0;
    color: #1a202c;
    
    &:hover {
      background-color: #f7fafc;
    }
  `
      : `
    background-color: #3182ce;
    border: none;
    color: white;
    
    &:hover {
      background-color: #2c5282;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AlertDialogContent = styled(DialogContent)`
  max-width: 400px;
`;

interface AlertDialogTitleProps {
  success: boolean;
}

const AlertDialogTitle = styled(DialogTitle)<AlertDialogTitleProps>`
  color: ${(props) => (props.success ? "#38a169" : "#e53e3e")};
`;

const AlertDialogDescription = styled.p`
  margin: 1rem 0;
  color: #4a5568;
`;
