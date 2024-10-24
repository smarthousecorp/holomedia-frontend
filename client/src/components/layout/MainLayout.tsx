import {Outlet} from "react-router";
import {styled} from "styled-components";
import Header from "../commons/Header";
import Sidebar from "../commons/Sidebar";

const MainLayout = () => {
  return (
    <Full>
      <Header />
      <Inner>
        <Sidebar />
        <Container>
          <Outlet />
        </Container>
      </Inner>
    </Full>
  );
};

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
  background-color: #000000;
  padding-top: 8rem;
  display: flex;
`;

const Container = styled.main`
  width: 100%;
  padding-left: 25rem; // sidebar가 있으면 그대로, 없어지면 0으로 해야함 (전역상태관리 사용 예정)
`;

export default MainLayout;
