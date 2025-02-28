import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../types/user";

interface PaymentHistory {
  creatorNickname: string;
  fileName: string;
  pointAmount: number;
  createdAt: string;
}

interface ChargeHistory {
  cardInfo: string;
  pgcode: string;
  payInfo: string;
  taxAmount: number;
  amount: number;
  tid: string;
  orderNo: string;
  paymentNo: number;
  chargeAt: string;
}

const PaymentManage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const memberNo = useSelector((state: RootState) => state.user.memberNo);
  const [activeTab, setActiveTab] = useState<"payment" | "history">("payment");
  const [historyType, setHistoryType] = useState<"use" | "charge">("charge");
  const [member, setMember] = useState<User>({
    memberNo: 0,
    nickname: "",
    point: 0,
    loginId: "",
    urls: {
      background: "",
      profile: "",
    },
  });
  console.log(member);

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [chargeHistory, setChargeHistory] = useState<ChargeHistory[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 꿀 계산 함수
  const calculateHoney = (amount: number) => {
    // 여기에 실제 계산식 적용
    // 1000원 + 부가세 10% 당 1꿀 (1100원)
    return Math.floor(amount / 1100);
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await api.get(`/point/use/history?memberNo=${memberNo}`);
      if (response.data.code === 0) {
        setPaymentHistory(response.data.data);
      }
    } catch (error) {
      console.error("결제 내역 조회 실패:", error);
    }
  };

  const fetchChargeHistory = async () => {
    try {
      const response = await api.get(
        `/point/payment/history?memberNo=${memberNo}`
      );
      if (response.data.code === 0) {
        setChargeHistory(response.data.data);
      }
    } catch (error) {
      console.error("포인트 충전 내역 조회 실패:", error);
    }
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await api.get(`member?memberNo=${memberNo}`);
        setMember(response.data.data);
      } catch (error) {
        console.error("멤버 조회 실패 :", error);
      }
    };
    fetchMemberData();
  }, [memberNo]);

  useEffect(() => {
    if (activeTab === "history") {
      if (historyType === "use") {
        fetchPaymentHistory();
      } else {
        fetchChargeHistory();
      }
    }
  }, [activeTab, historyType]);

  return (
    <Container>
      <Header onClick={() => navigate("/settings")}>
        <ChevronLeft size={22} />
        <Title>{t("settings.payment")}</Title>
      </Header>

      <TabContainer>
        <Tab
          active={activeTab === "payment"}
          onClick={() => setActiveTab("payment")}
        >
          결제 수단
        </Tab>
        <Tab
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        >
          결제 내역
        </Tab>
      </TabContainer>

      {activeTab === "payment" ? (
        <PaymentMethodContainer>
          <HoneyInfoContainer>
            <HoneyLabel>보유 꿀</HoneyLabel>
            <HoneyAmount>{member.point} 🍯</HoneyAmount>
          </HoneyInfoContainer>
          <AddPaymentButton>
            <PlusIcon>+</PlusIcon>
            신용/체크 카드 추가
          </AddPaymentButton>
        </PaymentMethodContainer>
      ) : (
        <>
          <HistoryTabContainer>
            <HistoryTab
              active={historyType === "charge"}
              onClick={() => setHistoryType("charge")}
            >
              포인트 충전 내역
            </HistoryTab>
            <HistoryTab
              active={historyType === "use"}
              onClick={() => setHistoryType("use")}
            >
              콘텐츠 구매 내역
            </HistoryTab>
          </HistoryTabContainer>

          {historyType === "use" ? (
            <HistoryContainer>
              {paymentHistory.map((item, index) => (
                <HistoryItem key={index}>
                  <HistoryContent>
                    <HistoryHeader>
                      <CreatorName>{item.creatorNickname}</CreatorName>
                      <PointAmount>{item.pointAmount} 🍯</PointAmount>
                    </HistoryHeader>
                    <FileName>{item.fileName}</FileName>
                  </HistoryContent>
                  <DateText>{formatDate(item.createdAt)}</DateText>
                </HistoryItem>
              ))}
            </HistoryContainer>
          ) : (
            <HistoryContainer>
              {chargeHistory.map((item, index) => (
                <ChargeItem key={index}>
                  <ChargeContent>
                    <ChargeHeader>
                      <CardInfo>{item.payInfo}</CardInfo>
                      <AmountContainer>
                        <ChargeAmount>
                          {item.amount.toLocaleString()}원
                        </ChargeAmount>
                        <HoneyAmount2>
                          {calculateHoney(item.amount)} 🍯
                        </HoneyAmount2>
                      </AmountContainer>
                    </ChargeHeader>
                    <CardNumber>{item.cardInfo}</CardNumber>
                    <OrderNumber>주문번호: {item.orderNo}</OrderNumber>
                  </ChargeContent>
                  <DateText>{formatDate(item.chargeAt)}</DateText>
                </ChargeItem>
              ))}
            </HistoryContainer>
          )}
        </>
      )}
    </Container>
  );
};

export default PaymentManage;

const Container = styled.section`
  max-width: 468px;
  padding: 20px;
`;

const Header = styled.div`
  cursor: pointer;
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 0;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

const Tab = styled.div<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1.6rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#000" : "#6b7280")};
  border-bottom: 2px solid
    ${(props) => (props.active ? "#eb3553" : "transparent")};
`;

const HistoryTabContainer = styled.div`
  display: flex;
  margin: 0 12px 20px 12px;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
`;

const HistoryTab = styled.div<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#fff" : "#6b7280")};
  background-color: ${(props) => (props.active ? "#eb3553" : "transparent")};
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
`;

const PaymentMethodContainer = styled.div`
  padding: 0 12px;
`;

const HoneyInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
`;

const HoneyLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const HoneyAmount = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const AddPaymentButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  background-color: white;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    background-color: #f9fafb;
  }
`;

const PlusIcon = styled.span`
  font-size: 20px;
  font-weight: 300;
`;

const HistoryContainer = styled.div`
  padding: 0 12px;
`;

const HistoryItem = styled.div`
  position: relative;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const HistoryContent = styled.div`
  flex: 1;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CreatorName = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const PointAmount = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const FileName = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const ChargeItem = styled.div`
  position: relative;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const ChargeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; // 변경: center에서 flex-start로
  margin-bottom: 8px;
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const ChargeAmount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #eb3553;
`;

const HoneyAmount2 = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #f59e0b; // 꿀 색상
`;

const ChargeContent = styled.div`
  flex: 1;
`;

const CardInfo = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const CardNumber = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
`;

const OrderNumber = styled.p`
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
`;

const DateText = styled.span`
  position: absolute;
  right: 0;
  bottom: 8px;
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
`;
