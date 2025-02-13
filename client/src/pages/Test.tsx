import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { api } from "../utils/api";

// Types
interface ReviewStatus {
  total_spots: number;
  current_applications: number;
  status: "OPEN" | "CLOSED";
}

interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

interface ApplicationResponse {
  success: boolean;
  applicationId?: number;
}

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const Status = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StatusText = styled.p<{ isFull?: boolean }>`
  margin: 5px 0;
  font-size: 16px;
  color: ${(props) => (props.isFull ? "#ff0000" : "#333")};
`;

const Button = styled.button<{ isCancel?: boolean }>`
  background: ${(props) => (props.isCancel ? "#ff4444" : "#4CAF50")};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ isError: boolean }>`
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  background: ${(props) => (props.isError ? "#ffe6e6" : "#e6ffe6")};
  color: ${(props) => (props.isError ? "#ff0000" : "#008000")};
`;

const Test: React.FC = () => {
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // 실제 구현 시에는 props나 context로 받아올 값들
  const userId: string = "test_user_id";
  const productId: string = "test_product_id";

  const fetchStatus = async (): Promise<void> => {
    try {
      const response = await api.get<ReviewStatus>(
        `/api/review-status/${productId}`
      );
      if (!response.data) {
        setStatus({
          total_spots: 0,
          current_applications: 0,
          status: "CLOSED",
        });
        return;
      }
      setStatus(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showMessage(
          error.response?.data?.error || "상태 조회 중 오류가 발생했습니다.",
          true
        );
      }
    }
  };

  const applyForReview = async (): Promise<void> => {
    try {
      const response = await axios.post<ApplicationResponse>("/api/apply", {
        productId,
        userId,
      });
      console.log(response);

      showMessage("체험단 신청이 완료되었습니다.");
      fetchStatus();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showMessage(
          error.response?.data?.error || "신청 중 오류가 발생했습니다.",
          true
        );
      }
    }
  };

  const cancelApplication = async (): Promise<void> => {
    try {
      const response = await axios.post<ApiResponse<null>>("/api/cancel", {
        productId,
        userId,
      });
      console.log(response);

      showMessage("신청이 취소되었습니다.");
      fetchStatus();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showMessage(
          error.response?.data?.error || "취소 중 오류가 발생했습니다.",
          true
        );
      }
    }
  };

  const showMessage = (msg: string, error: boolean = false): void => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    fetchStatus();
    console.log(status);
  }, []);

  const isFull = status
    ? status.current_applications >= status.total_spots
    : false;

  return (
    <Container>
      <Title>체험단 신청</Title>

      {status && (
        <Status>
          <StatusText>총 모집인원: {status.total_spots}명</StatusText>
          <StatusText>
            현재 신청인원: {status.current_applications}명
          </StatusText>
          <StatusText isFull={isFull}>
            {isFull
              ? "모집이 마감되었습니다."
              : `남은 인원: ${
                  status.total_spots - status.current_applications
                }명`}
          </StatusText>
        </Status>
      )}

      {message && <Message isError={isError}>{message}</Message>}

      <Button
        onClick={applyForReview}
        disabled={isFull || status?.status !== "OPEN"}
      >
        체험단 신청하기
      </Button>

      <Button
        isCancel
        onClick={cancelApplication}
        style={{ marginLeft: "10px" }}
      >
        신청 취소하기
      </Button>
    </Container>
  );
};

export default Test;
