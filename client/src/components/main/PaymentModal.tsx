import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { X } from "lucide-react";
import GgulImg from "../../assets/Ggul.png";
import { api } from "../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useUserInfo } from "../../hooks/useUserInfo";
import { useTranslation } from "react-i18next";
import { getCurrencyInfo } from "../../utils/currencyConverter";
import { useCountryDetector } from "../../hooks/useCountryDetector";

interface PaymentModalProps {
  onClose: () => void;
}

const HONEY_TO_WON_RATE = 1000; // 1꿀 = 1000원
const VAT_RATE = 0.1; // 10% 부가세

type Currency = "USD" | "JPY";

const PaymentModal = ({ onClose }: PaymentModalProps) => {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
  const [isForeignPayment, setIsForeignPayment] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");

  const memberNo = useSelector((state: RootState) => state.user.memberNo);
  const { userInfo } = useUserInfo(memberNo);
  const { countryInfo, isLoading: isCountryLoading } = useCountryDetector();

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

  // 통화 변환
  useEffect(() => {
    const convertCurrency = async () => {
      if (isForeignPayment && totalPrice > 0) {
        try {
          console.log("Converting currency with params:", {
            amountInKrw: totalPrice,
            currency: selectedCurrency,
          });

          const result = await getCurrencyInfo({
            amountInKrw: totalPrice,
            currency: selectedCurrency,
          });

          console.log("Currency conversion result:", result);

          if (result && result.data) {
            const rawAmount = result.data.rawAmountInForeignCurrency;
            const exchangeRateStr = result.data.exchangeRate;

            console.log("Parsed values:", {
              rawAmount,
              exchangeRateStr,
            });

            setConvertedAmount(rawAmount || null);
            setExchangeRate(
              exchangeRateStr ? parseFloat(exchangeRateStr) : null
            );
          }
        } catch (error) {
          console.error("Currency conversion failed:", error);
          setConvertedAmount(null);
          setExchangeRate(null);
        }
      } else {
        setConvertedAmount(null);
        setExchangeRate(null);
      }
    };

    convertCurrency();
  }, [isForeignPayment, totalPrice, selectedCurrency]);

  // 위치 기반 결제 설정
  useEffect(() => {
    if (countryInfo && !isCountryLoading) {
      const countryCode = countryInfo.countryCode.toLowerCase();

      // 한국이 아닌 경우 자동으로 해외 결제 선택
      if (countryCode !== "kr") {
        setIsForeignPayment(true);

        // 국가별 통화 설정
        switch (countryCode) {
          case "jp":
            setSelectedCurrency("JPY");
            break;
          case "us":
            setSelectedCurrency("USD");
            break;
          default:
            setSelectedCurrency("USD"); // 기본값
        }
      }
    }
  }, [countryInfo, isCountryLoading]);

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

  const handlePaymentLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsForeignPayment(e.target.id === "foreign");
  };

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const formatExchangeRate = (rate: number | null) => {
    if (rate === null) return "0.00";
    return rate.toFixed(2);
  };

  const handleClickPaymentBtn = () => {
    api
      .post(
        "/api/payment/request",
        {
          pgcode: isForeignPayment ? "creditcard_global" : "creditcard",
          memberId: userInfo?.loginId,
          productName: selectedAmount?.toString() || customAmount,
          price: totalPrice,
          currency: isForeignPayment ? "USD" : "KRW",
          convertedAmount: isForeignPayment ? convertedAmount : null,
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

    const handleMainWindowClick = (e: MouseEvent) => {
      if (isPaymentPending) {
        e.preventDefault();
        e.stopPropagation();
        alert(t("payment.modal.alerts.inProgress"));
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
  }, [paymentWindow, isPaymentPending, t]);

  return (
    <Background>
      <Container>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>

        <Header>{t("payment.modal.title")}</Header>

        <Content>
          <SectionTitle>
            {t("payment.modal.sections.productSelection")}
          </SectionTitle>
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
            placeholder={t("payment.modal.customAmount.placeholder")}
          />

          <SectionTitle>
            {t("payment.modal.sections.paymentMethod")}
          </SectionTitle>
          <PaymentContainer>
            <CheckboxContainer>
              <CheckboxLabel htmlFor="domestic">
                <span>{t("payment.modal.paymentLocation.domestic")}</span>
                <RadioInput
                  type="radio"
                  id="domestic"
                  name="payment"
                  checked={!isForeignPayment}
                  onChange={handlePaymentLocationChange}
                />
              </CheckboxLabel>
            </CheckboxContainer>
            <CheckboxContainer>
              <CheckboxLabel htmlFor="foreign">
                <span>{t("payment.modal.paymentLocation.foreign")}</span>
                <RadioInput
                  type="radio"
                  id="foreign"
                  name="payment"
                  checked={isForeignPayment}
                  onChange={handlePaymentLocationChange}
                />
              </CheckboxLabel>
            </CheckboxContainer>
          </PaymentContainer>

          {isForeignPayment && (
            <CurrencySelector>
              <CurrencyButton
                selected={selectedCurrency === "USD"}
                onClick={() => handleCurrencyChange("USD")}
              >
                USD
              </CurrencyButton>
              <CurrencyButton
                selected={selectedCurrency === "JPY"}
                onClick={() => handleCurrencyChange("JPY")}
              >
                JPY
              </CurrencyButton>
            </CurrencySelector>
          )}

          <PriceSection>
            <SectionTitle>
              {t("payment.modal.sections.totalAmount")}
            </SectionTitle>
            <PriceRow>
              <span>{t("payment.modal.priceBreakdown.price")}</span>
              <span>₩ {formatPrice(basePrice)}</span>
            </PriceRow>
            <PriceRow>
              <span>{t("payment.modal.priceBreakdown.vat")}</span>
              <span>₩ {formatPrice(vat)}</span>
            </PriceRow>
            {isForeignPayment &&
              convertedAmount !== null &&
              exchangeRate !== null && (
                <>
                  <PriceRow>
                    <span>환율</span>
                    <span>
                      1 {selectedCurrency} = ₩{" "}
                      {formatExchangeRate(exchangeRate)}
                    </span>
                  </PriceRow>
                  <PriceRow>
                    <span>변환 금액</span>
                    <span>
                      {selectedCurrency === "USD" ? "$" : "¥"}{" "}
                      {convertedAmount?.toFixed(2) || "0.00"}
                    </span>
                  </PriceRow>
                </>
              )}
            <TotalRow>
              <span>{t("payment.modal.priceBreakdown.total")}</span>
              <span>
                {isForeignPayment && convertedAmount !== null
                  ? `${selectedCurrency === "USD" ? "$" : "¥"} ${
                      convertedAmount.toFixed(2) || "0.00"
                    }`
                  : `₩ ${formatPrice(totalPrice)}`}
              </span>
            </TotalRow>
          </PriceSection>

          <PayButton
            onClick={handleClickPaymentBtn}
            disabled={isPaymentPending}
          >
            {isPaymentPending
              ? t("payment.modal.button.processing")
              : t("payment.modal.button.pay")}
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

const CurrencySelector = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const CurrencyButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #eb3553;
  border-radius: 0.25rem;
  background-color: ${(props) => (props.selected ? "#eb3553" : "white")};
  color: ${(props) => (props.selected ? "white" : "#eb3553")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.selected ? "#eb3553" : "#fff5f7")};
  }
`;
