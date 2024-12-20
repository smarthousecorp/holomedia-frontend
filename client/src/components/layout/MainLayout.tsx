import {Outlet} from "react-router";
import {styled} from "styled-components";

const MainLayout = () => {
  return (
    <Full>
      <Inner>
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
  overflow-x: hidden;
  background-color: #ffffff;
  display: flex;
`;

const Container = styled.main`
  width: 100%;
`;

export default MainLayout;
