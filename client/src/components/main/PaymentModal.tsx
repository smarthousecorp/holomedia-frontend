import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { X } from "lucide-react";
import GgulImg from "../../assets/Ggul.png";

interface PaymentModalProps {
  onClose: () => void;
}

const HONEY_TO_WON_RATE = 1000; // 1꿀 = 1000원
const VAT_RATE = 0.1; // 10% 부가세

const PaymentModal = ({ onClose }: PaymentModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

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

          <CheckboxContainer>
            <CheckboxLabel htmlFor="foreignCheck">한국에서 결제</CheckboxLabel>
            <Checkbox type="checkbox" id="foreignCheck" />
          </CheckboxContainer>
          <CheckboxContainer>
            <CheckboxLabel htmlFor="foreignCheck">해외에서 결제</CheckboxLabel>
            <Checkbox type="checkbox" id="foreignCheck" />
          </CheckboxContainer>

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
              <span>결제 금액</span>
              <span>₩ {formatPrice(totalPrice)}</span>
            </TotalRow>
          </PriceSection>

          <PayButton onClick={onClose}>결제하기</PayButton>
        </Content>
      </Container>
    </Background>
  );
};

export default PaymentModal;

const Background = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Container = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  width: 400px;
  padding: 2rem;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  color: #6b7280;

  &:hover {
    color: #374151;
  }
`;

const Header = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
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
  padding: 0.75rem 1rem;
  border: 1px solid #eb3553;
  border-radius: 0.25rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(235, 53, 83, 0.2);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #6b7280;
`;

const Checkbox = styled.input`
  border-radius: 0.25rem;
  border-color: #d1d5db;

  &:checked {
    background-color: #eb3553;
    border-color: #eb3553;
  }
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
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
`;

const TotalRow = styled(PriceRow)`
  font-weight: bold;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #eb3553;
  color: white;
  border-radius: 0.25rem;
  font-size: 1.125rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f55c75;
  }
`;
