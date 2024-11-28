import styled from "styled-components";
import logo from "../../assets/logo_test.png";
import {useNavigate} from "react-router-dom";
import {getCookie} from "../../utils/cookie";

const Header = () => {
  const navigate = useNavigate();
  const isLogin = getCookie("accessToken");

  return (
    <>
      <Container>
        <Logo>
          <img
            src={logo}
            alt="로고"
            onClick={() => navigate(isLogin ? "/main" : "/")}
          />
        </Logo>
      </Container>
    </>
  );
};

export default Header;

const Container = styled.header`
  width: 100%;
  height: 7rem;
  background: #ffffff;
  position: fixed;
  top: 0;
  z-index: 999;
  display: none;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 900px) {
    display: flex;
  }
`;

const Logo = styled.div`
  height: 7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 3.7rem;

  > svg {
    font-size: 2.4rem;
    color: white;
  }

  > img {
    width: 14rem;
  }

  @media (max-width: 600px) {
    margin-left: 2.7rem;

    & > svg {
      font-size: 2.1rem;
    }
  }
`;
