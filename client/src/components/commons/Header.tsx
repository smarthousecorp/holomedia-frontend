import styled from "styled-components";
import logo from "../../assets/holomedia-logo.png";
import SearchIcon from "@mui/icons-material/Search";
import {SvgIcon} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {on} from "../../store/slices/modal";

const Header = () => {
  const modal = useSelector((state: RootState) => state.modal.loginModal);
  console.log(modal);

  const dispatch = useDispatch();

  const handleClickLoginBtn = () => {
    dispatch(on());
  };

  return (
    <>
      <Container>
        <Logo>
          <img src={logo} alt="로고" />
        </Logo>
        <Right>
          <InputContainer>
            <Input placeholder="검색어를 입력해주세요" />
            <SvgIcon component={SearchIcon} />
          </InputContainer>
          <LoginBtn onClick={handleClickLoginBtn}>로그인 / 회원가입</LoginBtn>
        </Right>
      </Container>
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
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 3rem;
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
