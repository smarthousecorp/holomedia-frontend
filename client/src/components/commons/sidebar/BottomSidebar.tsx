import styled, { css } from "styled-components";
import homeIcon from "../../../assets/home.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useLocation, useNavigate } from "react-router-dom";

interface BottomSidebarProps {
  onProfileClick: () => void;
}

const BottomSidebar = ({ onProfileClick }: BottomSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const profileImage = useSelector(
    (state: RootState) => state.user.profile_image
  );

  return (
    <Container $path={location.pathname}>
      <Home
        onClick={() => {
          navigate("/main");
        }}
      >
        <img src={homeIcon} alt="홈 아이콘" />
      </Home>
      <Profile onClick={onProfileClick}>
        <img src={profileImage} alt="프로필 이미지" />
      </Profile>
    </Container>
  );
};

export default BottomSidebar;

const Container = styled.nav<{
  $path?: string;
}>`
  display: none;
  width: 100vw;
  height: 6.5rem;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  z-index: 999;
  padding: 0 4rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

  /* video 페이지 체크 */
  ${({ $path }) => {
    const isVideoPath = /^\/video\/[^/]+$/.test($path || "");
    if (isVideoPath) {
      return css`
        display: none !important;
      `;
    }
  }}

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Home = styled.div``;

const Profile = styled.div`
  cursor: pointer;
`;
