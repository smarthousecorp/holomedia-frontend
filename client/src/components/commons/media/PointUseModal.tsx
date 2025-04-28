import React, { useState } from "react";
import styled from "styled-components";
import { api } from "../../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { board } from "../../../types/board";
import { useTranslation } from "react-i18next";

interface Creator {
  nickname: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: board;
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
  const { t } = useTranslation();
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
        boardNo: board.boardNo,
        pointAmount: board.point,
        creatorNickname: creator.nickname,
        fileName: board.title,
      });

      if (response.data.code === 0) {
        setPaymentResult({
          success: true,
          message: t("pointUseModal.paymentComplete"),
        });
        onPaymentComplete();
      } else {
        setPaymentResult({
          success: false,
          message: response.data.message || t("pointUseModal.paymentError"),
        });
      }
    } catch (error) {
      console.log(error);
      setPaymentResult({
        success: false,
        message: t("pointUseModal.networkError"),
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
        <ModalOverlay onClick={onClose}>
          <ModalContainer
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </CloseButton>

            <ModalHeader>
              <ModalTitle>{t("pointUseModal.title")}</ModalTitle>
              <ModalSubtitle>{t("pointUseModal.subtitle")}</ModalSubtitle>
            </ModalHeader>

            <ContentSection>
              <ProductInfo>
                <ProductIcon>🎬</ProductIcon>
                <ProductDetails>
                  <ProductTitle>{board.title}</ProductTitle>
                  <ProductCreator>
                    {creator.nickname}
                    {t("pointUseModal.productInfo.video")}
                  </ProductCreator>
                </ProductDetails>
              </ProductInfo>

              <Divider />

              <PriceSection>
                <PriceLabel>{t("pointUseModal.payment.amount")}</PriceLabel>
                <PriceAmount>
                  <PointIcon>🍯</PointIcon>
                  <PointValue>
                    {board.point.toLocaleString()}{" "}
                    {t("pointUseModal.payment.points")}
                  </PointValue>
                </PriceAmount>
              </PriceSection>
            </ContentSection>

            <ActionButtons>
              <CancelButton onClick={onClose}>
                {t("pointUseModal.buttons.cancel")}
              </CancelButton>
              <PayButton
                onClick={handlePayment}
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeOpacity="0.25"
                      />
                      <path
                        d="M12 2C6.47715 2 2 6.47715 2 12"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </LoadingSpinner>
                ) : (
                  t("pointUseModal.buttons.pay")
                )}
              </PayButton>
            </ActionButtons>
          </ModalContainer>
        </ModalOverlay>
      )}

      {showResult && (
        <ModalOverlay onClick={() => setShowResult(false)}>
          <ResultModalContainer
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <ResultIcon success={paymentResult.success}>
              {paymentResult.success ? (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle
                    cx="24"
                    cy="24"
                    r="24"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M16 24L22 30L32 18"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle
                    cx="24"
                    cy="24"
                    r="24"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M16 16L32 32M32 16L16 32"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </ResultIcon>
            <ResultTitle success={paymentResult.success}>
              {paymentResult.success
                ? t("pointUseModal.result.success")
                : t("pointUseModal.result.failure")}
            </ResultTitle>
            <ResultMessage>{paymentResult.message}</ResultMessage>
            <ConfirmButton
              onClick={() => {
                setShowResult(false);
                if (paymentResult.success) {
                  onClose();
                }
              }}
              success={paymentResult.success}
            >
              {t("pointUseModal.buttons.confirm")}
            </ConfirmButton>
          </ResultModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

export default PointUseModal;

// 스타일드 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #666;
  }
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  padding-right: 24px;
  color: #191f28;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #8b95a1;
  margin: 4px 0 0;
`;

const ContentSection = styled.div`
  padding: 24px;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const ProductIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #191f28;
`;

const ProductCreator = styled.p`
  font-size: 14px;
  color: #8b95a1;
  margin: 0;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #f2f4f6;
  margin: 16px 0;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceLabel = styled.span`
  font-size: 15px;
  color: #4e5968;
`;

const PriceAmount = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const PointIcon = styled.span`
  font-size: 16px;
  margin-right: 6px;
`;

const PointValue = styled.span`
  font-size: 18px;
  color: #eb3553;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
  padding: 0 24px 24px;
`;

const CancelButton = styled.button`
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  background-color: #f2f4f6;
  border: none;
  color: #4e5968;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ebedf0;
  }
`;

interface PayButtonProps {
  isLoading: boolean;
}

const PayButton = styled.button<PayButtonProps>`
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  background-color: #eb3553;
  border: none;
  color: white;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: #ff627c;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ResultModalContainer = styled(ModalContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  max-width: 360px;
`;

interface ResultProps {
  success: boolean;
}

const ResultIcon = styled.div<ResultProps>`
  color: ${(props) => (props.success ? "#00CE7C" : "#FF5D5D")};
  margin-bottom: 16px;
`;

const ResultTitle = styled.h2<ResultProps>`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
  color: ${(props) => (props.success ? "#00CE7C" : "#FF5D5D")};
`;

const ResultMessage = styled.p`
  font-size: 15px;
  color: #4e5968;
  text-align: center;
  margin: 0 0 24px;
`;

const ConfirmButton = styled.button<ResultProps>`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.success ? "#00CE7C" : "#FF5D5D")};
  border: none;
  color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.success ? "#00B570" : "#E54747")};
  }
`;
