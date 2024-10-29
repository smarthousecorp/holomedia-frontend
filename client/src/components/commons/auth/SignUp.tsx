import styled from "styled-components";
import Social from "./Social";
import Input from "../Input";
import Button from "../Button";
import React, {useState} from "react";
import axios, {AxiosError} from "axios";
import {useSignUpValidation} from "../../../utils/SignUpValid";
import {checkId, checkPassword, checkUsername} from "../../../utils/validCheck";

export interface SignUp {
  [key: string]: any;
  user_id: string;
  password: string;
  passwordCheck: string;
  username: string;
}

interface ErrorMsg {
  user_id: string;
  password: string;
  passwordCheck: string;
  username: string;
}

const SignUp = () => {
  // 입력값 상태 관리
  const [inputVal, setInputVal] = useState<SignUp>({
    user_id: "",
    password: "",
    passwordCheck: "",
    username: "",
  });

  // 입력값 유효성 검사 에러 메세지
  const [errorMsg, setErrorMsg] = useState<ErrorMsg>({
    user_id: "",
    password: "",
    passwordCheck: "",
    username: "",
  });

  // custom valid 함수 사용
  const validationResults = useSignUpValidation(inputVal);

  // // 비밀번호 입력 창의 type=password or text
  // const [isVisible, setIsVisible] = useState<boolean>(false);

  // 입력 값이 변경될 때 실행되는 함수
  const onChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setInputVal({...inputVal, [name]: value});

    switch (name) {
      case "passwordCheck":
        if (inputVal.password === value) {
          setErrorMsg({...errorMsg, [name]: ""});
        } else {
          setErrorMsg({...errorMsg, [name]: "비밀번호가 일치하지 않습니다."});
        }
    }
  };

  const onBlurIdInput = () => {
    const msg = {user_id: ""};
    const {user_id} = inputVal;

    if (!checkId(user_id)) {
      msg.user_id = "6~15자의 영문 소문자 및 숫자가 포험되어야 합니다.";
    }

    setErrorMsg({...errorMsg, ...msg});
  };

  // 입력창 blur 이벤트 시
  const onBlurPwdInputs = () => {
    const msg = {password: "", passwordCheck: ""};
    const {password, passwordCheck} = inputVal;

    if (!checkPassword(password)) {
      msg.password =
        "8~15자, 영문 대소문자+숫자+특수문자 조합으로 구성되어야 합니다.";
      if (passwordCheck !== "" && password !== passwordCheck) {
        msg.passwordCheck = "비밀번호가 일치하지 않습니다.";
        setErrorMsg({...errorMsg, ...msg});
      } else {
        setErrorMsg({...errorMsg, ...msg});
      }
    } else if (passwordCheck !== "" && password !== passwordCheck) {
      msg.passwordCheck = "비밀번호가 일치하지 않습니다.";
      setErrorMsg({...errorMsg, ...msg});
    } else {
      setErrorMsg({...errorMsg, ...msg});
    }
  };

  const onBlurNameInput = () => {
    const msg = {username: ""};
    const {username} = inputVal;

    if (!checkUsername(username)) {
      msg.username = "2~12자의 한글, 영문, 숫자로 구성되어야 합니다.";
    }

    setErrorMsg({...errorMsg, ...msg});
  };

  // // 비밀번호 표시/감추기 버튼 클릭 시 실행되는 함수
  // const onClickVisibleBtn = () => {
  //   setIsVisible(!isVisible);
  // };

  const onClickSignUpBtn = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}/signup`, inputVal)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        const axiosError = error as AxiosError;
        console.error(axiosError.response?.data);
      });
  };
  return (
    <SignUpContainer>
      <Social auth={"회원가입"} />
      <SignUpInputContainer>
        <Title>회원가입</Title>
        <Input
          type="id"
          name="user_id"
          label="아이디"
          placeholder="6~15자의 영문, 소문자, 숫자"
          onChange={onChangeValues}
          onBlur={onBlurIdInput}
          error={errorMsg.user_id}
        />
        <Input
          type="password"
          name="password"
          label="비밀번호"
          placeholder="8~15자의 영문 대소문자, 숫자, 특수문자 (!@#$%^&*)"
          onChange={onChangeValues}
          onBlur={onBlurPwdInputs}
          error={errorMsg.password}
        />
        <Input
          type="password"
          name="passwordCheck"
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          onChange={onChangeValues}
          onBlur={onBlurPwdInputs}
          error={errorMsg.passwordCheck}
        />
        <Input
          type="text"
          name="username"
          label="닉네임"
          placeholder="2~12자 한글, 영문, 숫자"
          onChange={onChangeValues}
          onBlur={onBlurNameInput}
          error={errorMsg.username}
        />
        <Button
          width="80%"
          radius="50px"
          padding="1.8rem 1.6rem"
          onClick={onClickSignUpBtn}
          disabled={
            !validationResults.idValid ||
            !validationResults.passwordValid ||
            !validationResults.passwordsMatch ||
            !validationResults.usernameValid
          }
        >
          회원가입
        </Button>
      </SignUpInputContainer>
    </SignUpContainer>
  );
};

export default SignUp;

const SignUpContainer = styled.div``;

const Title = styled.div`
  margin: 2.5rem 0;
  display: flex;
  justify-content: center;
  font-family: "Pretendard-Bold";
  font-size: 1.4rem;
`;

const SignUpInputContainer = styled.div`
  > button {
    margin-top: 3rem;
  }

  > div {
    margin-bottom: 3rem;
  }
`;
