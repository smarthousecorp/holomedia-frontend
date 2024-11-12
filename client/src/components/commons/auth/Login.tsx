import styled from "styled-components";
import Social from "./Social";
import Input from "../Input";
import Button from "../Button";
import React, {useState} from "react";
import axios from "axios";
import {setCookie} from "../../../utils/cookie";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {off} from "../../../store/slices/modal";
import {login} from "../../../store/slices/user";
import {useTranslation} from "react-i18next";

interface Login {
  user_id: string;
  password: string;
}

const Login = () => {
  const {t} = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputVal, setInputVal] = useState<Login>({
    user_id: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState<Login>({user_id: "", password: ""});

  // 입력 값이 변경될 때 실행되는 함수
  const onChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setInputVal({...inputVal, [name]: value});
  };

  const onClickLoginBtn = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}/login`, inputVal)
      .then((res) => {
        const current = new Date();
        current.setMinutes(current.getMinutes() + 1440);

        setCookie("accessToken", res.data.accessToken, {
          path: "/",
          expires: current,
        });
        localStorage.setItem("accessToken", res.data.accessToken);

        // current.setMinutes(current.getMinutes() + 1440);
        // setCookie("refreshToken", res.data.refreshToken, {
        //   path: "/",
        //   expires: current,
        // });

        // 전역상태 user에 로그인 상태 및 이름 저장
        dispatch(
          login({
            isLoggedIn: true,
            username: res.data.username,
            is_adult_verified: res.data.is_adult_verified,
            is_admin: res.data.is_admin,
          })
        );

        // 모달 종료 후 메인화면 이동
        dispatch(off());
        navigate("/");
      })
      .catch((error) => {
        // 404 : 회원이 존재하지 않음 , 400 : 비밀번호가 일치하지 않음
        if (error.response.data.status === 404) {
          setErrorMsg({
            ...error,
            user_id: t("auth.login.errors.userNotFound"),
          });
        }

        if (error.response.data.status === 400) {
          const errorMessage = error.response.data.message;

          if (errorMessage === "비밀번호가 틀립니다.") {
            setErrorMsg({
              ...error,
              password: t("auth.login.errors.wrongPassword"),
            });
          } else {
            setErrorMsg({
              ...error,
              password: t("auth.login.errors.requiredFields"),
            });
          }
        }
      });
  };

  return (
    <LoginContainer>
      <Social auth={"login"} />
      <LoginInputContainer>
        <Title>{t("auth.modal.title.login")}</Title>
        <Input
          type="id"
          name="user_id"
          placeholder={t("auth.login.idPlaceholder")}
          onChange={onChangeValues}
          error={errorMsg.user_id}
        />
        <Input
          type="password"
          name="password"
          placeholder={t("auth.login.passwordPlaceholder")}
          onChange={onChangeValues}
          error={errorMsg.password}
        />
        <Button
          width="80%"
          radius="50px"
          padding="1.8rem 1.6rem"
          onClick={onClickLoginBtn}
        >
          {t("auth.login.button")}
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
