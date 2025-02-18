import { useEffect, useState } from "react";
import styled from "styled-components";
import { CheckCircle2, CreditCard, Calendar, Tag } from "lucide-react";
import { api } from "../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../store";

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

const PaymentSuccess = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const memberNo = useSelector((state: RootState) => state.user.memberNo);

  useEffect(() => {
    const fetchPaymentInfo = async (): Promise<void> => {
      try {
        const response = await api.post("/api/payment/member/info", {
          memberNo: memberNo,
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
    return <PageWrapper>Loading...</PageWrapper>;
  }

  if (error || !paymentInfo) {
    return (
      <PageWrapper>
        <ErrorMessage>
          {error || "결제 정보를 불러올 수 없습니다."}
        </ErrorMessage>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ContentContainer>
        <SuccessCard>
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
                {paymentInfo.pay_info} (
                {formatCardNumber(paymentInfo.card_info)})
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

          <ButtonContainer>
            <BackToHomeButton onClick={() => (window.location.href = "/main")}>
              홈으로 돌아가기
            </BackToHomeButton>
          </ButtonContainer>
        </SuccessCard>
      </ContentContainer>
    </PageWrapper>
  );
};

export default PaymentSuccess;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 36rem;
  margin: 0 auto;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
`;

const IconWrapper = styled.div`
  width: 5rem;
  height: 5rem;
  background-color: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  svg {
    width: 3rem;
    height: 3rem;
    color: #22c55e;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin: 1.5rem 0 0.75rem;
  color: #111827;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4b5563;
  font-size: 1.1rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const InfoValue = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #111827;
`;

const TotalAmount = styled.div`
  border-top: 2px solid #e5e7eb;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
`;

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AmountLabel = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const AmountValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #22c55e;
`;

const ButtonContainer = styled.div`
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
`;

const BackToHomeButton = styled.button`
  background-color: #22c55e;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #16a34a;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  font-size: 1.1rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;
