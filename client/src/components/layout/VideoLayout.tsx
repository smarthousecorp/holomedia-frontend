import styled from "styled-components";
import { Outlet } from "react-router-dom";

const VideoLayout = () => {
  return (
    <LayoutContainer>
      <Outlet />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #000;
`;

export default VideoLayout;
