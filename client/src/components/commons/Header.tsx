import styled from "styled-components";
import logo from "../../assets/bloom-logo.png";
import {useNavigate} from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Logo>
          <img
            src={logo}
            alt="로고"
            onClick={() => {
              navigate("/");
            }}
          />
        </Logo>
      </Container>
    </>
  );
};

export default Header;

const Container = styled.header`
  width: 100%;
  height: 8rem;
  background: #ffffff;
  position: fixed;
  top: 0;
  z-index: 999;
  display: none;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Logo = styled.div`
  height: 8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 3.7rem;

  > svg {
    font-size: 2.4rem;
    color: white;
  }

  > img {
    width: 10rem;
  }

  @media (max-width: 600px) {
    margin-left: 2.7rem;
    & > img {
      width: 8rem;
    }

    & > svg {
      font-size: 2.1rem;
    }
  }
`;
