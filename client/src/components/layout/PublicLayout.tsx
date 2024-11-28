import {Outlet} from "react-router";
import {styled} from "styled-components";
import Header from "../commons/Header";
import DefaultSidebar from "../commons/sidebar/DefaultSidebar";
import BottomSidebar from "../commons/sidebar/BottomSidebar";

const PublicLayout = () => {
  return (
    <Full>
      <Header />
      <Inner>
        <DefaultSidebar />
        <Container>
          <Outlet />
        </Container>
        <BottomSidebar />
      </Inner>
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
  background-color: #ffffff;
  display: flex;

  @media (max-width: 900px) {
    padding-top: 5rem;
  }
`;

const Container = styled.main`
  width: 100%;
  background-color: #ffffff;
`;
