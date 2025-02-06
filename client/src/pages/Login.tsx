// pages/Login.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import logo from "../assets/holomedia-logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
// import { setCookie } from "../utils/cookie";
import { login } from "../store/slices/user";
import { api } from "../utils/api";
import CustomCheckbox from "../components/commons/CustomCheckbox";

interface LoginCredentials {
  id: string;
  password: string;
}

interface ErrorMsg {
  id: string;
  password: string;
}

interface Apiresponse {
  code: number;
  data: {
    id: string;
    nickname: string;
    // profile_image: string;
    // is_adult_verified: boolean;
    // is_admin: boolean;
    // is_uploader: boolean;
    // bloom: number;
  } | null;
  message: string;
  timestamp: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputVal, setInputVal] = useState<LoginCredentials>({
    id: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState<ErrorMsg>({
    id: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberID, setRememberID] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("remembered_id");
    if (savedUserId) {
      setInputVal((prev) => ({ ...prev, id: savedUserId }));
      setRememberID(true);
    }
  }, []);

  const onChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputVal((prev) => ({ ...prev, [name]: value }));
    setErrorMsg((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onClickLoginBtn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post<Apiresponse>(`/login`, inputVal);

      if (rememberID) {
        localStorage.setItem("remembered_id", inputVal.id);
      } else {
        localStorage.removeItem("remembered_id");
      }

      // 에러 코드에 따른 처리
      if (res.data.code !== 0) {
        switch (res.data.code) {
          case 1: // 아이디가 없는 경우
            setErrorMsg((prev) => ({
              ...prev,
              id: t("auth.login.errors.userNotFound"),
            }));
            return;
          case 2: // 비밀번호가 틀린 경우
            setErrorMsg((prev) => ({
              ...prev,
              password: t("auth.login.errors.wrongPassword"),
            }));
            return;
          default:
            setErrorMsg((prev) => ({
              ...prev,
              password: res.data.message,
            }));
            return;
        }
      }

      // 로그인 성공 처리
      if (res.data.code === 0 && res.data.data) {
        if (rememberID) {
          localStorage.setItem("remembered_id", inputVal.id);
        } else {
          localStorage.removeItem("remembered_id");
        }

        dispatch(
          login({
            isLoggedIn: true,
            id: res.data.data.id,
            nickname: res.data.data.nickname,
          })
        );

        navigate("/main");
      }
    } catch (error: any) {
      console.log(error);

      // if (error.response) {
      //   let errorMessage = "";
      //   switch (error.res.data.status) {
      //     case 404:
      //       setErrorMsg((prev) => ({
      //         ...prev,
      //         id: t("auth.login.errors.userNotFound"),
      //       }));
      //       break;
      //     case 400:
      //       errorMessage = error.res.data.message;
      //       if (errorMessage === "비밀번호가 틀립니다.") {
      //         setErrorMsg((prev) => ({
      //           ...prev,
      //           password: t("auth.login.errors.wrongPassword"),
      //         }));
      //       } else {
      //         setErrorMsg((prev) => ({
      //           ...prev,
      //           password: t("auth.login.errors.requiredFields"),
      //         }));
      //       }
      //       break;
      //     default:
      //       console.error("Login error:", error);
      //   }
      // }
    }
  };

  const handleRememberIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberID(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("remembered_id");
    }
  };

  return (
    <Container>
      <LoginBox>
        <Logo>
          <img src={logo} alt={t("auth.social.loginTitle")} />
        </Logo>
        <Title>{t("auth.modal.title.login")}</Title>
        <Form onSubmit={onClickLoginBtn}>
          <InputWrapper>
            <Input
              name="id"
              placeholder={t("auth.login.idPlaceholder")}
              value={inputVal.id}
              onChange={onChangeValues}
            />
            <CustomCheckboxLabel>
              <CustomCheckbox
                checked={rememberID}
                onChange={handleRememberIDChange}
                label={t("auth.login.rememberID")}
              />
            </CustomCheckboxLabel>
          </InputWrapper>
          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("auth.login.passwordPlaceholder")}
              value={inputVal.password}
              onChange={onChangeValues}
            />
            <PasswordToggle type="button" onClick={togglePasswordVisibility}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggle>
          </InputWrapper>
          {(errorMsg.id || errorMsg.password) && (
            <ErrorMessage>{errorMsg.id || errorMsg.password}</ErrorMessage>
          )}
          <LoginButton type="submit">{t("auth.login.button")}</LoginButton>
          <About>
            <a onClick={() => navigate("/signup")}>
              {t("auth.modal.title.signup")}
            </a>
            <div className="idpw">
              <a href="#">{t("auth.login.findAccount")} |</a>
              <a href="#">{t("auth.login.findPassword")}</a>
            </div>
          </About>
        </Form>
      </LoginBox>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  height: 100vh;
  background-color: #f0f0f0;
`;

const LoginBox = styled.div`
  background-color: white;
  padding: 3.5rem 5.5rem;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 335px;
  min-height: 500px;
  width: 100%;
`;

const Logo = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  > img {
    width: 20rem;
  }
`;
const Title = styled.h3`
  font-size: 2rem;
  margin-bottom: 3rem;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d0d0d0;

  &:first-child {
    padding-right: 8rem;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 0;
  font-size: 1.3rem;
  width: 100%;
`;
const PasswordToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #707070;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #eb3553;
  }
`;

const Button = styled.button`
  background-color: #eb3553;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1.3rem;
  cursor: pointer;
`;

const LoginButton = styled(Button)`
  margin-top: 1.5rem;
`;

const About = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;

  a {
    position: relative;
    text-decoration: none;
    color: #333;
    transition: color 0.3s ease;

    &:hover {
      color: #eb3553;
    }

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -3px;
      left: 0;
      background-color: #eb3553;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }

  > .idpw {
    display: flex;
    gap: 0.3rem;
    white-space: nowrap;

    a {
      margin-right: 0.3rem;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  text-align: left;
`;

const CustomCheckboxLabel = styled.div`
  position: absolute;
  right: 0;
`;
