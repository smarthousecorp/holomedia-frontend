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
}

interface RefundModalProps {
  refundItems: RefundItem[];
  onClose: () => void;
  onSuccess: () => void;
}

const RefundRequest = ({ refundItems, onClose, onSuccess }: RefundModalProps) => {
  const [items, setItems] = useState<RefundItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RefundItem | null>(null);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // props로 받은 목록을 상태로 복사
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

      // ✅ 해당 항목의 refundable을 false로 설정
      selectedItem.refundable = false;

      // ✅ 새 배열로 강제 렌더링
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

  // 필터링된 목록
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
                <Label>TID</Label>
                <Value>{selectedItem.tid}</Value>
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
                {item.amount.toLocaleString()}원 - {item.tid}
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

export default RefundRequest;

// ------------------------------
// styled-components
// ------------------------------

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
