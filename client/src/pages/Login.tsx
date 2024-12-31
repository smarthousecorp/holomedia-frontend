import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import logo from "../assets/holomedia-logo.png";
import { Check, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { setCookie } from "../utils/cookie";
import { login } from "../store/slices/user";

interface LoginCredentials {
  user_id: string;
  password: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputVal, setInputVal] = useState<LoginCredentials>({
    user_id: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState<LoginCredentials>({
    user_id: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberID, setRememberID] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("remembered_user_id");
    if (savedUserId) {
      setInputVal((prev) => ({ ...prev, user_id: savedUserId }));
      setRememberID(true);
    }

    const autoLoginEnabled = localStorage.getItem("auto_login") === "true";
    setAutoLogin(autoLoginEnabled);

    if (autoLoginEnabled) {
      const savedToken = localStorage.getItem("accessToken");
      if (savedToken) {
        handleAutoLogin(savedToken);
      }
    }
  }, []);

  const handleAutoLogin = async (token: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_DOMAIN}/validate-token`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.valid) {
        dispatch(
          login({
            isLoggedIn: true,
            user_id: response.data.user_id,
            username: response.data.username,
            profile_image: response.data.profile_image,
            background_image: response.data.background_image,
            is_adult_verified: response.data.is_adult_verified,
            is_admin: response.data.is_admin,
            is_uploader: response.data.is_uploader,
            bloom: response.data.bloom,
          })
        );
        navigate("/main");
      }
    } catch (error) {
      console.error("Auto login failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("auto_login");
      setAutoLogin(false);
    }
  };

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
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/login`,
        inputVal
      );

      if (rememberID) {
        localStorage.setItem("remembered_user_id", inputVal.user_id);
      } else {
        localStorage.removeItem("remembered_user_id");
      }

      localStorage.setItem("auto_login", autoLogin.toString());

      const current = new Date();
      current.setMinutes(current.getMinutes() + 1440);

      setCookie("accessToken", res.data.accessToken, {
        path: "/",
        expires: current,
      });
      localStorage.setItem("accessToken", res.data.accessToken);

      dispatch(
        login({
          isLoggedIn: true,
          user_id: res.data.user_id,
          username: res.data.username,
          profile_image: res.data.profile_image,
          is_adult_verified: res.data.is_adult_verified,
          is_admin: res.data.is_admin,
          is_uploader: res.data.is_uploader,
          bloom: res.data.bloom,
        })
      );

      navigate("/main");
    } catch (error: any) {
      if (error.response) {
        let errorMessage = "";
        switch (error.response.data.status) {
          case 404:
            setErrorMsg((prev) => ({
              ...prev,
              user_id: t("auth.login.errors.userNotFound"),
            }));
            break;
          case 400:
            errorMessage = error.response.data.message;
            if (errorMessage === "비밀번호가 틀립니다.") {
              setErrorMsg((prev) => ({
                ...prev,
                password: t("auth.login.errors.wrongPassword"),
              }));
            } else {
              setErrorMsg((prev) => ({
                ...prev,
                password: t("auth.login.errors.requiredFields"),
              }));
            }
            break;
          default:
            console.error("Login error:", error);
        }
      }
    }
  };

  const handleRememberIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberID(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("remembered_user_id");
    }
  };

  const handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoLogin(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("auto_login");
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
              name="user_id"
              placeholder={t("auth.login.idPlaceholder")}
              value={inputVal.user_id}
              onChange={onChangeValues}
            />
            <CustomCheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={rememberID}
                onChange={handleRememberIDChange}
              />
              <CheckboxControl>
                <Check size={12} />
              </CheckboxControl>
              <span>{t("auth.login.rememberID")}</span>
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
          {(errorMsg.user_id || errorMsg.password) && (
            <ErrorMessage>{errorMsg.user_id || errorMsg.password}</ErrorMessage>
          )}
          <AutoLoginWrapper>
            <AutoCheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={autoLogin}
                onChange={handleAutoLoginChange}
              />
              <CheckboxControl>
                <Check size={12} />
              </CheckboxControl>
              <span>{t("auth.login.autoLogin")}</span>
            </AutoCheckboxLabel>
          </AutoLoginWrapper>
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
const AutoLoginWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  color: #707070;
`;

const checkboxAppear = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const CustomCheckboxLabel = styled.label`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #707070;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #eb3553;
  }

  span {
    transition: color 0.2s;
  }
`;

const AutoCheckboxLabel = styled(CustomCheckboxLabel)`
  position: relative;
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  background: white;
  transition: all 0.2s ease;

  svg {
    color: white;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.2s ease;
  }

  ${CheckboxInput}:checked + & {
    background: #eb3553;
    border-color: #eb3553;

    svg {
      opacity: 1;
      transform: scale(1);
      animation: ${checkboxAppear} 0.2s ease;
    }
  }

  ${CheckboxInput}:focus + & {
    box-shadow: 0 0 0 2px rgba(235, 53, 83, 0.2);
  }

  ${CustomCheckboxLabel}:hover & {
    border-color: #eb3553;
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
