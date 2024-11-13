// src/components/commons/Loading.tsx
import styled from "styled-components";
import {Loader2} from "lucide-react";

const Loading = () => {
  return (
    <LoadingContainer>
      <Loader2 size={48} className="spin" />
      <LoadingText>로딩중입니다...</LoadingText>
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000000;
  color: white;
  gap: 2rem;

  .spin {
    animation: spin 1s linear infinite;
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

const LoadingText = styled.h2`
  font-size: 2.4rem;
  color: #ff627c;
`;

export default Loading;
