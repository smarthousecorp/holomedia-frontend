import styled from "styled-components";
import { api } from "../utils/api";
import { useState, useEffect } from "react";

interface RefundItem {
  memberNo: number;
  paymentNo: number;
  tid: string;
  amount: number;
  pgcode: string;
  refundable: boolean;
  chargeAt: string; 
}

interface RefundModalProps {
  refundItems: RefundItem[];
  onClose: () => void;
  onSuccess: () => void;
}

const RefundRequestModal = ({ refundItems, onClose, onSuccess }: RefundModalProps) => {
  const [items, setItems] = useState<RefundItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RefundItem | null>(null);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setItems(refundItems);
  }, [refundItems]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("환불 사유를 입력해주세요.");
      return;
    }
    if (!selectedItem) return;

    setIsLoading(true);
    try {
      await api.post("api/payment/cancel/request", {
        memberNo: selectedItem.memberNo,
        paymentNo: selectedItem.paymentNo,
        tid: selectedItem.tid,
        reason: reason,
      });

      alert("환불 요청이 완료되었습니다.");
      selectedItem.refundable = false;
      setItems([...items]);
      setSelectedItem(null);
      setReason("");
      onSuccess();
    } catch (error: any) {
      console.error("환불 요청 실패:", error);
      alert(error.response?.data?.message || "환불 요청에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${d} ${h}:${min}`;
  };

  const visibleItems = items.filter((item) => item.refundable);

  return (
    <ModalOverlay>
      <ModalBox>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>환불 요청</Title>
        {selectedItem ? (
          <>
            <InfoBox>
              <InfoRow>
                <Label>결제 금액</Label>
                <Value>{selectedItem.amount.toLocaleString()}원</Value>
              </InfoRow>
              <InfoRow>
                <Label>PG사</Label>
                <Value>{selectedItem.pgcode}</Value>
              </InfoRow>
              <InfoRow>
                <Label>결제일시</Label>
                <Value>{formatDate(selectedItem.chargeAt)}</Value>
              </InfoRow>
              <ReasonInput
                placeholder="환불 사유를 입력하세요"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </InfoBox>
            <ButtonGroup>
              <SubmitButton onClick={handleSubmit} disabled={isLoading}>
                환불 요청
              </SubmitButton>
              <CancelButton
                onClick={() => {
                  setSelectedItem(null);
                  setReason("");
                }}
              >
                이전
              </CancelButton>
            </ButtonGroup>
          </>
        ) : (
          <ItemList>
            {visibleItems.map((item) => (
              <ItemButton key={item.paymentNo} onClick={() => setSelectedItem(item)}>
                 <ItemContent>
    <ItemAmount>{item.amount.toLocaleString()}원</ItemAmount>
    <ItemDate>결제일: {formatDate(item.chargeAt)}</ItemDate>
  </ItemContent>
              </ItemButton>
            ))}
            {visibleItems.length === 0 && (
              <NoData>환불 가능한 내역이 없습니다.</NoData>
            )}
          </ItemList>
        )}
      </ModalBox>
    </ModalOverlay>
  );
};

export default RefundRequestModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  text-align: center;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #374151;

  &:hover {
    color: #111827;
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111827;
`;

const InfoBox = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
`;

const Label = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
`;

const ReasonInput = styled.textarea`
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  min-height: 80px;
  background-color: #ffffff;
  color: #111827;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #eb3553;
  color: white;
  font-weight: 600;
  padding: 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    background-color: #d52e4c;
  }

  &:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  background-color: white;
  color: #374151;
  font-weight: 500;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemButton = styled.button`
  padding: 12px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #111827;
  text-align: left;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const NoData = styled.div`
  font-size: 14px;
  color: #9ca3af;
  text-align: center;
  margin-top: 20px;
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemAmount = styled.strong`
  font-size: 14px;
`;

const ItemDate = styled.span`
  font-size: 12px;
  color: #6b7280;
`;
