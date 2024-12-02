import {Outlet} from "react-router";
import {styled} from "styled-components";
import Header from "../commons/Header";
import DefaultSidebar from "../commons/sidebar/DefaultSidebar";
import BottomSidebar from "../commons/sidebar/BottomSidebar";
import {useEffect, useState} from "react";
import MobileSidebar from "../commons/sidebar/MobileSidebar";
import {useLocation} from "react-router-dom";

const PublicLayout = () => {
  const location = useLocation();
  const [isOpenBS, setIsOpenBS] = useState<boolean>(false);

  const toggleBottomSidebar = () => {
    setIsOpenBS(!isOpenBS);
  };

  useEffect(() => {
    if (isOpenBS) {
      // 사이드바가 열렸을 때 body의 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 사이드바가 닫혔을 때 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 스크롤 설정 초기화
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpenBS]);

  useEffect(() => {
    setIsOpenBS(false);
  }, [location]);

  return (
    <Full>
      <Header />
      <Inner>
        <DefaultSidebarStyled />
        <Container>
          <Outlet />
        </Container>
        <BottomSidebar onProfileClick={toggleBottomSidebar} />
      </Inner>
      {isOpenBS && (
        <OverlayBackground onClick={toggleBottomSidebar}>
          <MobileSidebar isOpen={isOpenBS} onClose={toggleBottomSidebar} />
        </OverlayBackground>
      )}
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
  background-color: #ededed;
  display: flex;

  @media (max-width: 900px) {
    padding-top: 7rem;
  }
`;

const Container = styled.main`
  width: 100%;
  background-color: #ededed;
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
