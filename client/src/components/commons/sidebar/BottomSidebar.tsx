import styled from "styled-components";
import homeIcon from "../../../assets/home.png";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

const BottomSidebar = () => {
  const profileImage = useSelector(
    (state: RootState) => state.user.profile_image
  );
  return (
    <Container>
      <Home>
        <img src={homeIcon} alt="홈 아이콘" />
      </Home>
      <Profile>
        <img src={profileImage} alt="프로필 이미지" />
      </Profile>
    </Container>
  );
};

export default BottomSidebar;

const Container = styled.nav`
  display: none;
  width: 100vw;
  height: 7rem;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  z-index: 999;
  padding: 0 4rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); // 상단에 부드러운 그림자 추가

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Home = styled.div``;

const Profile = styled.div``;
