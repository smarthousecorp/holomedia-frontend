import styled from "styled-components";
import Social from "./Social";
import Input from "../Input";
import Button from "../Button";
import React, {useState} from "react";
import axios, {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {useSignUpValidation} from "../../../utils/SignUpValid";
import {checkId, checkPassword, checkUsername} from "../../../utils/validCheck";
import {useDispatch} from "react-redux";
import {off} from "../../../store/slices/modal";
import {showToast} from "../../../store/slices/toast";
import Toast from "../Toast";
import {ToastType} from "../../../types/toast";

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
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [inputVal, setInputVal] = useState<SignUp>({
    user_id: "",
    password: "",
    passwordCheck: "",
    username: "",
  });

  const [errorMsg, setErrorMsg] = useState<ErrorMsg>({
    user_id: "",
    password: "",
    passwordCheck: "",
    username: "",
  });

  const validationResults = useSignUpValidation(inputVal);

  const onChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setInputVal({...inputVal, [name]: value});

    switch (name) {
      case "passwordCheck":
        if (inputVal.password === value) {
          setErrorMsg({...errorMsg, [name]: ""});
        } else {
          setErrorMsg({
            ...errorMsg,
            [name]: t("auth.signup.errors.passwordMismatch"),
          });
        }
    }
  };

  const onBlurIdInput = () => {
    const msg = {user_id: ""};
    const {user_id} = inputVal;

    if (!checkId(user_id)) {
      msg.user_id = t("auth.signup.errors.idFormat");
    }

    setErrorMsg({...errorMsg, ...msg});
  };

  const onBlurPwdInputs = () => {
    const msg = {password: "", passwordCheck: ""};
    const {password, passwordCheck} = inputVal;

    if (!checkPassword(password)) {
      msg.password = t("auth.signup.errors.passwordFormat");
      if (passwordCheck !== "" && password !== passwordCheck) {
        msg.passwordCheck = t("auth.signup.errors.passwordMismatch");
        setErrorMsg({...errorMsg, ...msg});
      } else {
        setErrorMsg({...errorMsg, ...msg});
      }
    } else if (passwordCheck !== "" && password !== passwordCheck) {
      msg.passwordCheck = t("auth.signup.errors.passwordMismatch");
      setErrorMsg({...errorMsg, ...msg});
    } else {
      setErrorMsg({...errorMsg, ...msg});
    }
  };

  const onBlurNameInput = () => {
    const msg = {username: ""};
    const {username} = inputVal;

    if (!checkUsername(username)) {
      msg.username = t("auth.signup.errors.usernameFormat");
    }

    setErrorMsg({...errorMsg, ...msg});
  };

  const onClickSignUpBtn = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}/signup`, inputVal)
      .then(() => {
        dispatch(off());
        Toast(ToastType.success, t("auth.signup.success"));
        dispatch(
          showToast({
            message: t("auth.signup.success"),
            type: "success",
          })
        );
      })
      .catch((error) => {
        const msg = {user_id: "", username: ""};
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 409) {
          const errorMessage = axiosError.response?.data;

          if (errorMessage === "이미 존재하는 아이디 입니다.") {
            msg.user_id = t("auth.signup.errors.duplicateId");
          } else if (errorMessage === "이미 존재하는 닉네임 입니다.") {
            msg.username = t("auth.signup.errors.duplicateUsername");
          }
          setErrorMsg({...errorMsg, ...msg});
        }
      });
  };

  return (
    <SignUpContainer>
      <Social auth={t("auth.modal.title.signup")} />
      <SignUpInputContainer>
        <Title>{t("auth.modal.title.signup")}</Title>
        <Input
          type="id"
          name="user_id"
          label={t("auth.signup.id")}
          placeholder={t("auth.signup.idPlaceholder")}
          onChange={onChangeValues}
          onBlur={onBlurIdInput}
          error={errorMsg.user_id}
        />
        <Input
          type="password"
          name="password"
          label={t("auth.signup.password")}
          placeholder={t("auth.signup.passwordPlaceholder")}
          onChange={onChangeValues}
          onBlur={onBlurPwdInputs}
          error={errorMsg.password}
        />
        <Input
          type="password"
          name="passwordCheck"
          label={t("auth.signup.passwordCheck")}
          placeholder={t("auth.signup.passwordCheckPlaceholder")}
          onChange={onChangeValues}
          onBlur={onBlurPwdInputs}
          error={errorMsg.passwordCheck}
        />
        <Input
          type="text"
          name="username"
          label={t("auth.signup.username")}
          placeholder={t("auth.signup.usernamePlaceholder")}
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
          {t("auth.signup.button")}
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
