import styled, {css} from "styled-components";
import logo from "../../assets/holomedia-logo.png";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import {SvgIcon} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {on} from "../../store/slices/modal";
import LoginModal from "./auth/LoginModal";
import {getCookie} from "../../utils/cookie";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Sidebar from "./Sidebar";

interface sidebarProps {
  isOpen: boolean;
}

const Header = () => {
  const modal = useSelector((state: RootState) => state.modal.loginModal);
  const user = useSelector((state: RootState) => state.user);
  const header = useSelector((state: RootState) => state.header.isOpen);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 햄버거 클릭 시 열릴 사이드바 상태
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);

  const handleClickLoginBtn = () => {
    dispatch(on());
  };

  const handleClickHamburger = () => {
    setIsOpenSidebar((prev) => !prev);
  };

  return (
    <>
      <Container>
        <Logo>
          {header && (
            <SvgIcon component={MenuIcon} onClick={handleClickHamburger} />
          )}
          <img
            src={logo}
            alt="로고"
            onClick={() => {
              navigate("/");
            }}
          />
        </Logo>
        <Right>
          <InputContainer>
            <Input placeholder="검색어를 입력해주세요" />
            <SvgIcon component={SearchIcon} />
          </InputContainer>
          {getCookie("accessToken") ? (
            <ProfileContainer>{user.username} 회원님</ProfileContainer>
          ) : (
            <LoginBtn onClick={handleClickLoginBtn}>로그인 / 회원가입</LoginBtn>
          )}
        </Right>
      </Container>
      {modal && <LoginModal />}
      {isOpenSidebar && (
        <Background>
          <CustomSidebar isOpen={isOpenSidebar} />
        </Background>
      )}
    </>
  );
};

export default Header;

const Container = styled.header`
  width: 100%;
  height: 8rem;
  background: #000000;
  /* border-bottom: 0.1rem solid #e2e2e2; */
  position: fixed;
  top: 0;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 3.7rem;

  > svg {
    font-size: 2.4rem;
    color: white;
  }

  > img {
    width: 25rem;
  }
`;

const Right = styled.div`
  width: 65%;
  display: flex;
  gap: 3rem;
  justify-content: space-between;
  align-items: center;
  margin-right: 6rem;
`;

const InputContainer = styled.div`
  width: 80%;
  position: relative;
  border-radius: 10px;
  background: #323232;
  display: flex;
  align-items: center;
  padding: 0 1rem 0 1.5rem;

  > svg {
    font-size: 2rem;
    color: white;
  }
`;

const Input = styled.input`
  font-family: "Pretendard-Medium";
  width: 100%;
  height: 4.5rem;
  background: #323232;
  border-radius: 10px;
  color: #ffffff;

  &::placeholder {
    color: #9c9c9c; /* placeholder 색상 */
  }
`;

const LoginBtn = styled.button`
  font-family: "Pretendard-Medium";
  width: 14rem;
  height: 4.5rem;
  background: #323232;
  border-radius: 10px;
  color: #ffffff;
  padding: 0 1rem;
  white-space: nowrap;
`;

const ProfileContainer = styled.div`
  display: flex;
  color: white;
  font-size: 1.8rem;
`;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 888;
  position: fixed;
  top: 0;
  left: 0;
`;

// 해당 스타일이 적용 되지 않는 이슈가 존재함. 추후 해결 예정
const CustomSidebar = styled(Sidebar)<sidebarProps>`
  position: fixed;
  left: -250px; /* 사이드바가 화면 밖에 위치하도록 설정 */
  transition: left 0.3s ease; /* 부드러운 애니메이션 효과 */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5); /* 그림자 효과 */
  z-index: 1000;

  ${({isOpen}) =>
    isOpen &&
    css`
      left: 0; /* 사이드바가 화면에 나타날 때 위치 */
    `}
`;
