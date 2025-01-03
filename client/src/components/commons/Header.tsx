import styled, { css } from "styled-components";
import logo from "../../assets/logo_test.png";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = getCookie("accessToken");

  return (
    <>
      <Container $path={location.pathname}>
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

const Container = styled.header<{ $path?: string }>`
  width: 100%;
  height: 7rem;
  background: #ffffff;
  position: fixed;
  top: 0;
  z-index: 999;
  display: none;
  justify-content: space-between;
  align-items: center;

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
