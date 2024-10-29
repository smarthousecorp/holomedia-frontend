import styled from "styled-components";
import Social from "./Social";
import Input from "../Input";
import Button from "../Button";
import React, {useState} from "react";
import axios from "axios";

interface Login {
  user_id: string;
  password: string;
}

const Login = () => {
  const [inputVal, setInputVal] = useState<Login>({
    user_id: "",
    password: "",
  });

  const handleChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal({...inputVal, user_id: e.target.value});
  };

  const handleChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal({...inputVal, password: e.target.value});
  };

  const onClickLoginBtn = () => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_DOMAIN}/login`,
          inputVal
        );
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error.response);
      }
    };

    fetchData();
  };

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
        <Button
          width="80%"
          radius="50px"
          padding="1.8rem 1.6rem"
          onClick={onClickLoginBtn}
        >
          로그인
        </Button>
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

const LoginInputContainer = styled.div`
  > button {
    margin-top: 3rem;
  }
`;
