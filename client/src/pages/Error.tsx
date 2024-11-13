// src/pages/ErrorPage.tsx
import styled from "styled-components";
import {Settings} from "lucide-react";
import {useNavigate} from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/");
    // 또는 이전 페이지로: navigate(-1);
  };

  return (
    <ErrorContainer>
      <Settings size={48} className="spin" />
      <ErrorText>
        예상하지 못한 오류가 발생했습니다. <br />
        서버의 일시적인 장애이거나 네트워크 문제일 수 있습니다. <br />
        잠시 후에 다시 시도해 주세요.
      </ErrorText>
      <RetryButton onClick={handleRetry}>다시 시도</RetryButton>
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  width: 100%;
  height: calc(100vh - 8rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000000;
  color: white;
  gap: 2rem;

  .spin {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorText = styled.h2`
  font-size: 2.4rem;
  color: #ff627c;
  text-align: center;
  line-height: 1.7;
`;

const RetryButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.6rem;
  background-color: transparent;
  border: 1px solid #ff627c;
  color: #ff627c;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff627c;
    color: white;
  }
`;

export default ErrorPage;
