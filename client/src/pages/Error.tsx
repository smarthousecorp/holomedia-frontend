import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  error: string;
}

const ErrorPage = ({ error }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/main");
  };

  return (
    <ErrorContainer>
      <Settings size={48} className="spin" />
      {error === "404" ? (
        <>
          <ErrorText>{t("error.404.message")}</ErrorText>
          <RetryButton onClick={handleRetry}>
            {t("error.404.button")}
          </RetryButton>
        </>
      ) : (
        <>
          <ErrorText>{t("error.unknown.message")}</ErrorText>
          <RetryButton onClick={handleRetry}>
            {t("error.unknown.button")}
          </RetryButton>
        </>
      )}
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
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
  white-space: pre-line;
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
