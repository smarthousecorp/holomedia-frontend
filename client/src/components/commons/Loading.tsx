// src/components/commons/Loading.tsx
import styled from "styled-components";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const Loading = () => {
  const { t } = useTranslation();

  return (
    <LoadingContainer>
      <Loader2 size={48} className="spin" />
      <LoadingText>{t("loading.message")}</LoadingText>
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
  background: #ededed;
  color: #000000;
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
