import styled from "styled-components";
import Social from "./Social";
import Input from "../Input";

const Login = () => {
  const handleChangeId = () => {};

  const handleChangePwd = () => {};

  return (
    <LoginContainer>
      <Social auth={"로그인"} />
      <LoginInputContainer>
        <Title>로그인</Title>
        <Input
          type="id"
          name="id"
          placeholder="아이디"
          onChange={handleChangeId}
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChangePwd}
        />
      </LoginInputContainer>
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

const LoginInputContainer = styled.div``;
