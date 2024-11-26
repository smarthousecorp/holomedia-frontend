import React, {useState} from "react";
import styled from "styled-components";
import logo from "../assets/bloom-logo.png";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {setCookie} from "../utils/cookie";
import {login} from "../store/slices/user";

interface LoginCredentials {
  user_id: string;
  password: string;
}

const Login: React.FC = () => {
  const {t} = useTranslation();
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

  // 입력값 변경 핸들러
  const onChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setInputVal((prev) => ({...prev, [name]: value}));
    setErrorMsg((prev) => ({...prev, [name]: ""}));
  };

  // 패스워드 숨기기/보이기 핸들러
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 로그인 버튼 핸들러
  const onClickLoginBtn = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}/login`, inputVal)
      .then((res) => {
        const current = new Date();
        current.setMinutes(current.getMinutes() + 1440);

        // accessToken 설정
        setCookie("accessToken", res.data.accessToken, {
          path: "/",
          expires: current,
        });
        localStorage.setItem("accessToken", res.data.accessToken);

        // 전역상태 업데이트
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

        // Navigate to main page
        navigate("/main");
      })
      .catch((error) => {
        if (error.response) {
          let errorMessage = "";
          // Handle specific error scenarios
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
              // Generic error handling
              console.error("Login error:", error);
          }
        }
      });
  };

  return (
    <Container>
      <LoginBox>
        <Logo>
          <img src={logo} alt="로고" />
        </Logo>
        <Title>로그인</Title>
        <Form onSubmit={onClickLoginBtn}>
          <InputWrapper>
            <Input
              name="user_id"
              placeholder="아이디"
              value={inputVal.user_id}
              onChange={onChangeValues}
            />
            <InputLabel>
              <input
                type="checkbox"
                checked={rememberID}
                onChange={() => setRememberID(!rememberID)}
              />{" "}
              아이디 저장
            </InputLabel>
          </InputWrapper>
          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호"
              value={inputVal.password}
              onChange={onChangeValues}
            />
            <PasswordToggle type="button" onClick={togglePasswordVisibility}>
              <i
                className={`bi ${
                  showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                }`}
              ></i>
            </PasswordToggle>
          </InputWrapper>
          {/* Display error messages */}
          {(errorMsg.user_id || errorMsg.password) && (
            <ErrorMessage>{errorMsg.user_id || errorMsg.password}</ErrorMessage>
          )}
          <AutoLoginWrapper>
            <AutoLoginLabel>
              <AutoLoginInput
                type="checkbox"
                checked={autoLogin}
                onChange={() => setAutoLogin(!autoLogin)}
              />{" "}
              자동 로그인
            </AutoLoginLabel>
          </AutoLoginWrapper>
          <LoginButton type="submit">로그인</LoginButton>
          <About>
            <a href="#">회원가입</a>
            <div className="idpw">
              <a href="#">계정 찾기 |</a>
              <a href="#">비밀번호 찾기</a>
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
    width: 10rem;
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
const InputLabel = styled.label`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  color: #707070;
  gap: 0.3rem;

  input[type="checkbox"] {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    border: 1px solid #999;
    appearance: none;
    cursor: pointer;
  }

  input[type="checkbox"]:checked {
    background: #eb3553;
    border: none;
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
  font-size: 1.3rem;
`;
const AutoLoginWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  color: #707070;
`;
const AutoLoginLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    margin: 0;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    border: 1px solid #999;
    appearance: none;
    cursor: pointer;
  }

  input[type="checkbox"]:checked {
    background: #eb3553;
    border: none;
  }
`;
const AutoLoginInput = styled.input`
  width: 1.2rem;
  height: 1.2rem;
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

  > .idpw {
    display: flex;
    gap: 0.3rem;
    white-space: nowrap;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  text-align: left;
`;
