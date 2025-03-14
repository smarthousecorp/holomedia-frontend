import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

// 에러 메시지 타입 정의
type ErrorType = "network" | "server" | "404" | "500" | "default";

type ErrorInfo = {
  title: string;
  message: string;
  icon: string;
};

// 에러 타입에 따른 메시지와 제목 설정
const errorMessages: Record<ErrorType, ErrorInfo> = {
  network: {
    title: "네트워크 오류",
    message:
      "서버 연결에 실패했습니다. 서버가 꺼져있거나 네트워크 설정이 올바르지 않습니다.",
    icon: "🔌",
  },
  server: {
    title: "서버 오류",
    message: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
    icon: "🚫",
  },
  "404": {
    title: "페이지를 찾을 수 없습니다",
    message: "요청하신 페이지가 존재하지 않거나 삭제되었습니다.",
    icon: "🔍",
  },
  "500": {
    title: "서버 내부 오류",
    message: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    icon: "⚠️",
  },
  default: {
    title: "오류가 발생했습니다",
    message:
      "알 수 없는 오류가 발생했습니다. 다시 시도하거나 관리자에게 문의하세요.",
    icon: "❓",
  },
};

// props 타입 정의
interface ErrorPageProps {
  error?: string;
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // 에러 타입 결정: props > 쿼리 파라미터 > 기본값
  const errorTypeParam = error || searchParams.get("type") || "default";
  // 타입 안전을 위한 체크
  const errorType = (
    Object.keys(errorMessages).includes(errorTypeParam)
      ? errorTypeParam
      : "default"
  ) as ErrorType;

  const { title, message, icon } = errorMessages[errorType];

  // 카운트다운 후 홈페이지로 리다이렉트
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // 홈으로 돌아가기
  const handleGoHome = () => {
    navigate("/");
  };

  // 새로고침
  const handleRefresh = () => {
    window.location.reload();
  };

  // 뒤로가기
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <ErrorContainer>
      <ErrorContent>
        <ErrorIcon>{icon}</ErrorIcon>
        <ErrorTitle>{title}</ErrorTitle>
        <ErrorMessage>{message}</ErrorMessage>
        <CountdownText>{countdown}초 후 홈페이지로 이동합니다...</CountdownText>
        <ButtonGroup>
          {/* 404 에러일 때는 뒤로가기 버튼 표시 */}
          {errorType === "404" ? (
            <CancelButton onClick={handleGoBack}>뒤로가기</CancelButton>
          ) : (
            <CancelButton onClick={handleRefresh}>새로고침</CancelButton>
          )}
          <ConfirmButton onClick={handleGoHome}>홈으로 가기</ConfirmButton>
        </ButtonGroup>
      </ErrorContent>
    </ErrorContainer>
  );
};

export default ErrorPage;

// 스타일 컴포넌트
const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
`;

const ErrorContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  padding: 32px 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #111827;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #4b5563;
  margin-bottom: 24px;
`;

const CountdownText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #dc2626;
  }
`;
