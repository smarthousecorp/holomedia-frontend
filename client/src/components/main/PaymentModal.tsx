import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { X } from "lucide-react";
import GgulImg from "../../assets/Ggul.png";
import { api } from "../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useUserInfo } from "../../hooks/useUserInfo";

interface PaymentModalProps {
  onClose: () => void;
}

const HONEY_TO_WON_RATE = 1000; // 1꿀 = 1000원
const VAT_RATE = 0.1; // 10% 부가세

const PaymentModal = ({ onClose }: PaymentModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);

  const memberNo = useSelector((state: RootState) => state.user.memberNo);
  const { userInfo, isLoading } = useUserInfo(memberNo);
  console.log(userInfo, isLoading);

  const amounts = [5, 10, 50, 100, 300];

  // 선택된 꿀의 양 계산
  const selectedHoney = useMemo(() => {
    if (selectedAmount !== null) {
      return selectedAmount;
    }
    return customAmount ? Number(customAmount) : 0;
  }, [selectedAmount, customAmount]);

  // 가격 계산
  const basePrice = selectedHoney * HONEY_TO_WON_RATE;
  const vat = Math.floor(basePrice * VAT_RATE);
  const totalPrice = basePrice + vat;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleClickPaymentBtn = () => {
    api
      .post(
        "/api/payment/request",
        {
          pgcode: "creditcard",
          memberId: userInfo?.loginId,
          productName: selectedAmount?.toString() || customAmount,
          price: totalPrice,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const options =
          "toolbar=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1200, height=800, top=0,left=0";
        const newWindow = window.open(
          res.data.data.urls.online_url,
          "_blank",
          options
        );
        if (newWindow) {
          setPaymentWindow(newWindow);
          setIsPaymentPending(true);
        }
      })
      .catch((error) => {
        console.error("Payment request failed:", error);
        setIsPaymentPending(false);
      });
  };

  // 결제 창 모니터링
  useEffect(() => {
    if (!paymentWindow) return;

    const checkPaymentWindow = setInterval(() => {
      if (paymentWindow.closed) {
        setIsPaymentPending(false);
        setPaymentWindow(null);
        clearInterval(checkPaymentWindow);
      }
    }, 500);

    // 결제 창이 열려있는 동안 메인 창 클릭 이벤트 방지
    const handleMainWindowClick = (e: MouseEvent) => {
      if (isPaymentPending) {
        e.preventDefault();
        e.stopPropagation();
        // 선택적: 사용자에게 결제 진행 중임을 알림
        alert("결제가 진행 중입니다. 결제창을 닫거나 완료 후 이용해주세요.");
      }
    };

    document.addEventListener("click", handleMainWindowClick, true);
    document.addEventListener("mousedown", handleMainWindowClick, true);
    document.addEventListener("mouseup", handleMainWindowClick, true);

    return () => {
      clearInterval(checkPaymentWindow);
      document.removeEventListener("click", handleMainWindowClick, true);
      document.removeEventListener("mousedown", handleMainWindowClick, true);
      document.removeEventListener("mouseup", handleMainWindowClick, true);
    };
  }, [paymentWindow, isPaymentPending]);

  return (
    <Background>
      <Container>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>

        <Header>꿀 충전</Header>

        <Content>
          <SectionTitle>상품 선택</SectionTitle>
          <AmountGrid>
            {amounts.map((amount) => (
              <AmountButton
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                selected={selectedAmount === amount}
              >
                <span>{amount}</span>
                <HoneyImage src={GgulImg} alt="honey" />
              </AmountButton>
            ))}
          </AmountGrid>

          <CustomAmountInput
            type="number"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="직접 입력 (꿀 개수)"
          />

          <SectionTitle>결제 수단</SectionTitle>
          <PaymentContainer>
            <CheckboxContainer>
              <CheckboxLabel id="domestic">
                <span>한국에서 결제</span>
                <RadioInput name="payment" id="domestic" defaultChecked />
              </CheckboxLabel>
            </CheckboxContainer>
            <CheckboxContainer>
              <CheckboxLabel id="foreign">
                <span>해외에서 결제</span>
                <RadioInput name="payment" id="foreign" />
              </CheckboxLabel>
            </CheckboxContainer>
          </PaymentContainer>

          <PriceSection>
            <SectionTitle>전체 금액</SectionTitle>
            <PriceRow>
              {/* 단위 표시 필요하면 추가 (₩{formatPrice(HONEY_TO_WON_RATE)}/꿀) */}
              <span>가격</span>
              <span>₩ {formatPrice(basePrice)}</span>
            </PriceRow>
            <PriceRow>
              {/* (10%) */}
              <span>부가세</span>
              <span>₩ {formatPrice(vat)}</span>
            </PriceRow>
            <TotalRow>
              <span>최종 결제 금액</span>
              <span>₩ {formatPrice(totalPrice)}</span>
            </TotalRow>
          </PriceSection>

          <PayButton
            onClick={handleClickPaymentBtn}
            disabled={isPaymentPending}
          >
            {isPaymentPending ? "결제 진행 중..." : "결제하기"}
          </PayButton>
        </Content>
      </Container>
      {isPaymentPending && <LoadingOverlay />}
    </Background>
  );
};

export default PaymentModal;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1001;
  cursor: not-allowed;
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Container = styled.div`
  background-color: white;
  border-radius: 1rem;
  width: 400px;
  padding: 3rem 2rem;
  position: relative;
`;

const CloseButton = styled.button<{ disabled?: boolean }>`
  position: absolute;
  right: 1.5rem;
  top: 2rem;
  color: ${(props) => (props.disabled ? "#ccc" : "#6b7280")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    color: ${(props) => (props.disabled ? "#ccc" : "#374151")};
  }
`;

const Header = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 3rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const SectionTitle = styled.h3`
  font-family: "Pretendard-Bold";
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`;

// const AmountGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 0.5rem;
//   margin-bottom: 0.75rem;
// `;

const AmountGrid = styled.div`
  display: flex;
  gap: 0.5rem;
`;

interface AmountButtonProps {
  selected?: boolean;
}

const AmountButton = styled.button<AmountButtonProps>`
  font-family: "Pretendard-Bold";
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: 1px solid #eb3553;
  background-color: ${(props) => (props.selected ? "#ff506d" : "#eb3553")};
  color: white;
  transition: all 0.2s;

  &:hover {
    background-color: #ff506d; // 또는 #f55c75
  }
`;

const HoneyImage = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;

const CustomAmountInput = styled.input`
  width: 100%;
  padding: 0.65rem 1rem;
  border: 1px solid #eb3553;
  border-radius: 0.25rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(235, 53, 83, 0.2);
  }
`;

const PaymentContainer = styled.div``;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #6b7280;
`;

const CheckboxLabel = styled.label`
  flex: 1;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;

  &#domestic {
    border-bottom: 1px solid #eb3553;
  }
`;

const RadioInput = styled.input.attrs({ type: "radio" })`
  appearance: none;
  width: 1.4rem;
  height: 1.4rem;
  border: 2px solid #eb3553;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;

  &:checked {
    background-color: white;
    border-color: #eb3553;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.7rem;
      height: 0.7rem;
      background-color: #eb3553;
      border-radius: 50%;
    }
  }

  &:hover {
    border-color: #ff506d;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(235, 53, 83, 0.2);
  }
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #eb3553;
`;

const TotalRow = styled(PriceRow)`
  font-size: 1.3rem;
  font-weight: bold;
  border-bottom: none;
`;

const PayButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 1rem;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#eb3553")};
  color: white;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 500;
  transition: background-color 0.2s;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "#f55c75")};
  }
`;
