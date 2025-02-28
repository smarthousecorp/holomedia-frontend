import { Outlet } from "react-router";
import { styled } from "styled-components";
import Header from "../commons/Header";
import DefaultSidebar from "../commons/sidebar/DefaultSidebar";
import BottomSidebar from "../commons/sidebar/BottomSidebar";
import { useEffect, useState } from "react";
import MobileSidebar from "../commons/sidebar/MobileSidebar";
import { useLocation } from "react-router-dom";
import PaymentModal from "../main/PaymentModal";
import RotatingBanner from "../main/RotatingBanner";

const PublicLayout = () => {
  const location = useLocation();

  const [isOpenBS, setIsOpenBS] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const showSidebarPaths = ["/main", "/creators", "/user", "/videos"];
  const shouldShowBanner = showSidebarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const toggleBottomSidebar = () => {
    setIsOpenBS(!isOpenBS);
  };

  const handlePaymentModalOpen = () => {
    setShowPaymentModal(true);
    setIsOpenBS(false);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };

  useEffect(() => {
    if (isOpenBS || showPaymentModal) {
      document.body.style.overflow = "hidden";
    } else {
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
    <LayoutContainer>
      <Header />
      <LayoutContent>
        <DefaultSidebarWrapper>
          <DefaultSidebarStyled onPaymentClick={handlePaymentModalOpen} />
        </DefaultSidebarWrapper>
        <MainContentWrapper $path={location.pathname}>
          <ContentContainer
            $isSettingsPage={location.pathname.startsWith("/settings")}
          >
            <MainSection>
              <Outlet />
            </MainSection>
          </ContentContainer>
          {shouldShowBanner && (
            <SideBannerContainer>
              <RotatingBanner />
            </SideBannerContainer>
          )}
        </MainContentWrapper>
        <BottomSidebar onProfileClick={toggleBottomSidebar} />
      </LayoutContent>
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
    </LayoutContainer>
  );
};

export default PublicLayout;

const LayoutContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const LayoutContent = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #ededed;
`;

const DefaultSidebarWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px; /* BaseSidebar에서 가져온 너비 */
  z-index: 10;

  @media (max-width: 900px) {
    display: none;
  }
`;

const DefaultSidebarStyled = styled(DefaultSidebar)`
  height: 100vh;

  @media (max-width: 900px) {
    display: none;
  }
`;

const MainContentWrapper = styled.div<{ $path?: string }>`
  display: flex;
  flex: 1;
  margin-left: 350px; /* 사이드바 너비 */
  height: 100vh;
  overflow-y: auto;
  gap: 2rem;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #eb3553 0%, #ff4d6a 100%);
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #d42e4a 0%, #eb3553 100%);
  }

  @media (max-width: 1150px) {
    gap: 0;
  }

  @media (max-width: 900px) {
    margin-left: 0;
    height: calc(100vh - 70px); /* 모바일 헤더 높이 70px 고려 */
    padding-top: 70px; /* 모바일 헤더 높이만큼 패딩 추가 */
    flex-direction: column;
  }
`;

const ContentContainer = styled.main<{ $isSettingsPage: boolean }>`
  flex: 1;
  max-width: ${(props) => (props.$isSettingsPage ? "none" : "950px")};
  background-color: ${(props) => (props.$isSettingsPage ? "#fff" : "#ededed")};
  border-left: ${(props) =>
    props.$isSettingsPage ? "2px solid #eee" : "none"};
  display: flex;
`;

const MainSection = styled.div`
  width: 100%;
  max-width: 950px;
  padding: 2rem 4rem 5rem;

  @media (max-width: 1200px) {
    padding: 2rem 2rem 5rem;
  }

  @media (max-width: 900px) {
    max-width: 100%;
    padding: 1rem 1rem 10rem;
  }
`;

const SideBannerContainer = styled.aside`
  width: 300px;
  flex-shrink: 0;
  margin-right: 4rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
  align-self: flex-start;

  @media (max-width: 1400px) {
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
