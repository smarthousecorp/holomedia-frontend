import { Outlet } from "react-router";
import { css, styled } from "styled-components";
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
      <LayoutInner $path={location.pathname}>
        <DefaultSidebarStyled onPaymentClick={handlePaymentModalOpen} />
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
      </LayoutInner>
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
  display: flex;
  flex-direction: column;
`;

const LayoutInner = styled.div<{ $path?: string }>`
  width: 100%;
  height: 100vh;
  background-color: #ededed;
  display: flex;
  overflow-y: auto;

  /* 웹킷 스크롤바 스타일링 */
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

  @media (max-width: 900px) {
    ${({ $path }) => {
      const isVideoPath = /^\/video\/[^/]+$/.test($path || "");
      return (
        !isVideoPath &&
        css`
          padding-top: 7rem;
        `
      );
    }}
    overflow-y: visible;
  }
`;

const MainContentWrapper = styled.div<{ $path?: string }>`
  display: flex;
  width: 100%;
  padding-top: ${({ $path }) =>
    $path?.startsWith("/settings") ? "0" : "2rem"};
  /* Content와 배너 사이의 간격을 flex gap으로 설정 */
  gap: 2rem;

  @media (max-width: 1150px) {
    /* 배너가 사라지는 시점에서 gap 제거 */
    gap: 0;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    padding-top: 0;
  }
`;

const ContentContainer = styled.main<{ $isSettingsPage: boolean }>`
  flex: 1;
  overflow-y: auto;
  background-color: ${(props) => (props.$isSettingsPage ? "#fff" : "#ededed")};
  border-left: ${(props) =>
    props.$isSettingsPage ? "2px solid #eee" : "none"};
  /* 컨텐츠 영역 가운데 정렬을 위한 설정 */
  display: flex;
  /* justify-content: center; */
`;

const MainSection = styled.div`
  width: 100%;
  max-width: 1050px;
  /* 여백은 유지하되 가로 스크롤 문제 해결 */
  padding: 0 4rem 5rem;

  /* 1200px 이하에서 패딩 조정 */
  @media (max-width: 1200px) {
    padding: 0 2rem 5rem;
  }

  @media (max-width: 900px) {
    max-width: 100%;
    padding: 0 1rem 10rem;
  }
`;

const SideBannerContainer = styled.aside`
  width: 300px; /* 배너 너비 고정 */
  flex-shrink: 0; /* 배너 크기 축소 방지 */
  margin-right: 4rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
  align-self: flex-start;

  @media (max-width: 1400px) {
    display: none;
  }
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
