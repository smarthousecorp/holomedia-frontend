import styled from "styled-components";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

const NotificationPage = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <IconWrapper>
        <Bell size={64} strokeWidth={1.5} />
      </IconWrapper>
      <NotificationText>
        <HighlightText>{t("notification.noNew")}</HighlightText>
      </NotificationText>
    </Container>
  );
};

const Container = styled.div`
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
  color: #333;
`;

const NotificationText = styled.h2`
  font-size: 2.4rem;
  color: #333;
  line-height: 1.5;
  max-width: 500px;
`;

const HighlightText = styled.span`
  color: #ff627c;
  font-weight: bold;
`;

export default NotificationPage;
