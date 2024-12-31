import styled from "styled-components";
import { Construction, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PreparePageProps {
  pageName: string;
}

const PreparePage = ({ pageName }: PreparePageProps) => {
  const { t } = useTranslation();

  return (
    <ErrorContainer>
      <IconWrapper>
        <Construction size={64} strokeWidth={1.5} />
        <Sparkles size={48} color="#ff627c" className="sparkle" />
      </IconWrapper>
      <ErrorText>
        <PageNameText>{pageName}</PageNameText>
        {t("prepare.message")}
        <HighlightText>{t("prepare.feature")}</HighlightText>
        <SubText>{t("prepare.comingSoon")}</SubText>
      </ErrorText>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  color: #000000;
  gap: 3rem;
  text-align: center;
  padding: 0 2rem;

  @media (max-width: 900px) {
    height: calc(100vh - 13.5rem);
  }
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .sparkle {
    position: absolute;
    top: -20px;
    right: -20px;
    animation: twinkle 1.5s ease-in-out infinite;
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
`;

const ErrorText = styled.h2`
  font-size: 2.4rem;
  color: #333;
  line-height: 1.5;
  max-width: 500px;
`;

const PageNameText = styled.span`
  color: #ff627c;
  font-weight: bold;
  margin-right: 0.5rem;
`;

const HighlightText = styled.span`
  color: #ff627c;
  font-weight: bold;
  margin-left: 0.5rem;
`;

const SubText = styled.div`
  font-size: 1.6rem;
  color: #666;
  margin-top: 1rem;
`;

export default PreparePage;
