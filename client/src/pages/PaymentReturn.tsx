import { useEffect, useState } from "react";
import styled from "styled-components";
import { CheckCircle2, CreditCard, Calendar, Tag } from "lucide-react";
import { api } from "../utils/api";

// 타입 정의
interface PaymentInfoData {
  pay_info: string;
  amount: number;
  domestic_flag: string;
  card_info: string;
  pgcode: string;
  product_name: string;
  order_no: string;
  transaction_date: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: PaymentInfoData;
}

const PaymentReturn = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentInfo = async (): Promise<void> => {
      try {
        const response = await api.post("/api/payment/member/info", {
          memberNo: 14,
        });

        if (!response.data) {
          throw new Error("결제 정보를 불러오는데 실패했습니다.");
        }

        const result: ApiResponse = await response.data;
        setPaymentInfo(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentInfo();
  }, []);

  const formatCardNumber = (cardInfo: string): string => {
    return cardInfo.replace(/(\d{4})(\d{6})(\d{4})/, "$1 •••••• $3");
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("ko-KR") + "원";
  };

  if (isLoading) {
    return <LoadingWrapper>Loading...</LoadingWrapper>;
  }

  if (error || !paymentInfo) {
    return (
      <LoadingWrapper>
        {error || "결제 정보를 불러올 수 없습니다."}
      </LoadingWrapper>
    );
  }

  return (
    <ModalOverlay>
      <ModalCard>
        <IconWrapper>
          <CheckCircle2 />
        </IconWrapper>

        <Title>결제 완료</Title>
        <Subtitle>결제가 성공적으로 완료되었습니다</Subtitle>

        <InfoContainer>
          <InfoRow>
            <InfoLabel>
              <Tag />
              <span>상품명</span>
            </InfoLabel>
            <InfoValue>{paymentInfo.product_name}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>
              <CreditCard />
              <span>결제 수단</span>
            </InfoLabel>
            <InfoValue>
              {paymentInfo.pay_info} ({formatCardNumber(paymentInfo.card_info)})
            </InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>
              <Calendar />
              <span>결제 일시</span>
            </InfoLabel>
            <InfoValue>{paymentInfo.transaction_date}</InfoValue>
          </InfoRow>

          <TotalAmount>
            <AmountRow>
              <AmountLabel>최종 결제 금액</AmountLabel>
              <AmountValue>{formatAmount(paymentInfo.amount)}</AmountValue>
            </AmountRow>
          </TotalAmount>
        </InfoContainer>
      </ModalCard>
    </ModalOverlay>
  );
};

export default PaymentReturn;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 28rem;
  padding: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  svg {
    width: 2.5rem;
    height: 2.5rem;
    color: #22c55e;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin: 1rem 0 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const InfoValue = styled.span`
  font-weight: 500;
`;

const TotalAmount = styled.div`
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
  padding-top: 1rem;
`;

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AmountLabel = styled.span`
  font-weight: 600;
`;

const AmountValue = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: #22c55e;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
