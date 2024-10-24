import styled from "styled-components";
import Social from "./Social";

const Login = () => {
  return (
    <LoginContainer>
      <Social auth={"로그인"} />
      <Title>로그인</Title>
    </LoginContainer>
  );
};

export default Login;

const LoginContainer = styled.div``;

const Title = styled.div`
  margin: 2.5rem 0;
  display: flex;
  justify-content: center;
  font-family: "Pretendard-Bold";
  font-size: 1.4rem;
`;
