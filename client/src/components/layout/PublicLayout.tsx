// PublicLayout.tsx
import { Outlet } from "react-router";
import { styled } from "styled-components";
import Header from "../commons/Header";
import DefaultSidebar from "../commons/sidebar/DefaultSidebar";
import BottomSidebar from "../commons/sidebar/BottomSidebar";
import { useEffect, useState } from "react";
import MobileSidebar from "../commons/sidebar/MobileSidebar";
import { useLocation } from "react-router-dom";
import PaymentModal from "../main/PaymentModal";

const PublicLayout = () => {
  const location = useLocation();

  const [isOpenBS, setIsOpenBS] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const toggleBottomSidebar = () => {
    setIsOpenBS(!isOpenBS);
  };

  const handlePaymentModalOpen = () => {
    setShowPaymentModal(true);
    setIsOpenBS(false); // 결제 모달이 열릴 때 MobileSidebar를 닫습니다
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };

  useEffect(() => {
    if (isOpenBS || showPaymentModal) {
      // 사이드바나 결제 모달이 열렸을 때 body의 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 둘 다 닫혔을 때 스크롤 복원
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpenBS, showPaymentModal]);

  useEffect(() => {
    setIsOpenBS(false);
  }, [location]);

  return (
    <Full>
      <Header />
      <Inner>
        <DefaultSidebarStyled onPaymentClick={handlePaymentModalOpen} />
        <Container $isSettingsPage={location.pathname === "/settings"}>
          <Outlet />
        </Container>
        <BottomSidebar onProfileClick={toggleBottomSidebar} />
      </Inner>
      {isOpenBS && (
        <OverlayBackground onClick={toggleBottomSidebar}>
          <MobileSidebar
            isOpen={isOpenBS}
            onClose={toggleBottomSidebar}
            onPaymentClick={handlePaymentModalOpen}
          />
        </OverlayBackground>
      )}
      {showPaymentModal && <PaymentModal onClose={handlePaymentModalClose} />}
    </Full>
  );
};

export default PublicLayout;

const Full = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Inner = styled.div`
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  background-color: #ededed;
  display: flex;

  @media (max-width: 900px) {
    padding-top: 7rem;
  }
`;

const Container = styled.main<{ $isSettingsPage: boolean }>`
  width: 100%;
  background-color: ${(props) => (props.$isSettingsPage ? "#fff" : "#ededed")};
  border-left: ${(props) =>
    props.$isSettingsPage ? "2px solid #eee" : "none"};
`;

const DefaultSidebarStyled = styled(DefaultSidebar)`
  @media (max-width: 900px) {
    display: none;
  }
`;

const OverlayBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;
