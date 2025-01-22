import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/holomedia-logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import axios, { AxiosError } from "axios";
import { useSignUpValidation } from "../utils/SignUpValid";
import { Eye, EyeOff } from "lucide-react";
import { checkId, checkPassword, checkUsername } from "../utils/validCheck";
import { showToast } from "../store/slices/toast";
import { ToastType } from "../types/toast";
import Toast from "../components/commons/Toast";
import { useAdultVerification } from "../hooks/useAdultVerification";
import AdultVerificationModal from "../components/commons/media/AdultVerificationModal";

interface SignUp {
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

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const validationResults = useSignUpValidation(inputVal);

  const {
    isVerificationModalOpen,
    isVerified,
    openVerificationModal,
    closeVerificationModal,
    handleVerificationComplete,
  } = useAdultVerification();

  // const handleClickPaymentBtn = () => {
  //   axios
  //     .post(
  //       "https://apiholomedia.duckdns.org/board/pg",
  //       {},
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then((res) => {
  //       console.log(res.data.online_url);
  //       const options =
  //         "toolbar=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1200, height=800, top=0,left=0";
  //       window.open(res.data.online_url, "_blank", options);
  //     });
  // };

  const onChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputVal({ ...inputVal, [name]: value });

    switch (name) {
      case "passwordCheck":
        if (inputVal.password === value) {
          setErrorMsg({ ...errorMsg, [name]: "" });
        } else {
          setErrorMsg({
            ...errorMsg,
            [name]: t("auth.signup.errors.passwordMismatch"),
          });
        }
    }
  };

  const onBlurIdInput = () => {
    const msg = { user_id: "" };
    const { user_id } = inputVal;

    if (!checkId(user_id)) {
      msg.user_id = t("auth.signup.errors.idFormat");
    }
    setErrorMsg({ ...errorMsg, ...msg });
  };

  const onBlurPwdInputs = () => {
    const msg = { password: "", passwordCheck: "" };
    const { password, passwordCheck } = inputVal;

    if (!checkPassword(password)) {
      msg.password = t("auth.signup.errors.passwordFormat");
      if (passwordCheck !== "" && password !== passwordCheck) {
        msg.passwordCheck = t("auth.signup.errors.passwordMismatch");
        setErrorMsg({ ...errorMsg, ...msg });
      } else {
        setErrorMsg({ ...errorMsg, ...msg });
      }
    } else if (passwordCheck !== "" && password !== passwordCheck) {
      msg.passwordCheck = t("auth.signup.errors.passwordMismatch");
      setErrorMsg({ ...errorMsg, ...msg });
    } else {
      setErrorMsg({ ...errorMsg, ...msg });
    }
  };

  const onBlurNameInput = () => {
    const msg = { username: "" };
    const { username } = inputVal;

    if (!checkUsername(username)) {
      msg.username = t("auth.signup.errors.usernameFormat");
    }
    setErrorMsg({ ...errorMsg, ...msg });
  };

  const onSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/signup`,
        inputVal
      );
      Toast(ToastType.success, t("auth.signup.success"));
      dispatch(
        showToast({
          message: t("auth.signup.success"),
          type: "success",
        })
      );
      navigate("/");
    } catch (error) {
      const msg = { user_id: "", username: "" };
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        const errorMessage = axiosError.response?.data;

        if (errorMessage === "이미 존재하는 아이디 입니다.") {
          msg.user_id = t("auth.signup.errors.duplicateId");
        } else if (errorMessage === "이미 존재하는 닉네임 입니다.") {
          msg.username = t("auth.signup.errors.duplicateUsername");
        }
        setErrorMsg({ ...errorMsg, ...msg });
      }
    }
  };

  return (
    <>
      <Container>
        <SignUpBox>
          <Logo onClick={() => navigate("/")}>
            <img src={logo} alt={t("auth.social.signupTitle")} />
          </Logo>
          <Title>{t("auth.modal.title.signup")}</Title>
          <Form onSubmit={onSubmitSignUp}>
            <InputWrapper>
              <Input
                name="user_id"
                placeholder={t("auth.signup.idPlaceholder")}
                value={inputVal.user_id}
                onChange={onChangeValues}
                onBlur={onBlurIdInput}
              />
            </InputWrapper>
            {errorMsg.user_id && (
              <ErrorMessage>{errorMsg.user_id}</ErrorMessage>
            )}

            <InputWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("auth.signup.passwordPlaceholder")}
                value={inputVal.password}
                onChange={onChangeValues}
                onBlur={onBlurPwdInputs}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            {errorMsg.password && (
              <ErrorMessage>{errorMsg.password}</ErrorMessage>
            )}

            <InputWrapper>
              <Input
                type={showPasswordCheck ? "text" : "password"}
                name="passwordCheck"
                placeholder={t("auth.signup.passwordCheckPlaceholder")}
                value={inputVal.passwordCheck}
                onChange={onChangeValues}
                onBlur={onBlurPwdInputs}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPasswordCheck(!showPasswordCheck)}
              >
                {showPasswordCheck ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            {errorMsg.passwordCheck && (
              <ErrorMessage>{errorMsg.passwordCheck}</ErrorMessage>
            )}

            <InputWrapper>
              <Input
                name="username"
                placeholder={t("auth.signup.usernamePlaceholder")}
                value={inputVal.username}
                onChange={onChangeValues}
                onBlur={onBlurNameInput}
              />
            </InputWrapper>
            {errorMsg.username && (
              <ErrorMessage>{errorMsg.username}</ErrorMessage>
            )}

            <VerificationButton
              type="button"
              onClick={openVerificationModal}
              // disabled={!inputVal.user_id || isVerified}
            >
              {isVerified ? "인증완료" : "본인인증"}
              <VerificationStatus verified={isVerified}>
                {isVerified && "✓"}
              </VerificationStatus>
            </VerificationButton>
            {/* 
            <VerificationButton type="button" onClick={handleClickPaymentBtn}>
              결제하기
            </VerificationButton> */}

            <SignUpButton
              type="submit"
              disabled={
                !validationResults.idValid ||
                !validationResults.passwordValid ||
                !validationResults.passwordsMatch ||
                !validationResults.usernameValid
              }
            >
              {t("auth.signup.button")}
            </SignUpButton>
            <About>
              <p onClick={() => navigate("/")}>
                {t("auth.signup.alreadyMember")}{" "}
                <span className="strong">{t("auth.modal.title.login")}</span>{" "}
                {/* {t("auth.signup.goToLogin")} */}
              </p>
            </About>
          </Form>
        </SignUpBox>
      </Container>
      {/* 모달 컴포넌트 추가 */}
      <AdultVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={closeVerificationModal}
        onComplete={handleVerificationComplete}
        isTestMode={false}
      />
    </>
  );
};

export default SignUp;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  height: 100vh;
  background-color: #f0f0f0;
`;

const SignUpBox = styled.div`
  background-color: white;
  padding: 3.5rem 5.5rem;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 335px;
  min-height: 500px;
  width: 100%;
`;

const Logo = styled.div`
  cursor: pointer;
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
  border: 1px solid #d0d0d0;
  margin-bottom: 1rem;
  border-radius: 10px;
`;

const Input = styled.input`
  border-radius: 10px;
  flex: 1;
  padding: 1rem;
  font-size: 1.2rem;
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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SignUpButton = styled(Button)`
  margin-top: 1.5rem;
`;

const About = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 1rem;
  color: #6e6d6d;

  span {
    cursor: pointer;
    position: relative;
    text-decoration: none;
    color: #6e6d6d;
    transition: color 0.3s ease;
    margin: 0 0.3rem;

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

  .strong {
    font-weight: 600;
    color: #eb3553;
  }
`;

const ErrorMessage = styled.div`
  position: relative;
  left: 3px;
  color: red;
  font-size: 1rem;
  margin-top: -1.5rem;
  margin-bottom: 0.5rem;
  text-align: left;
`;

// 버튼 스타일 컴포넌트
const VerificationButton = styled(Button)`
  background-color: white;
  color: ${(props) => (props.disabled ? "#cccccc" : "#eb3553")};
  border: 2px solid ${(props) => (props.disabled ? "#cccccc" : "#eb3553")};
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
  width: auto;
  min-width: 100px;

  &:hover:not(:disabled) {
    background-color: #eb3553;
    color: white;
  }

  &:disabled {
    border-color: #cccccc;
    cursor: not-allowed;
  }
`;
// 확인 표시 아이콘 컴포넌트
const VerificationStatus = styled.span<{ verified: boolean }>`
  margin-left: 8px;
  color: ${(props) => (props.verified ? "#4CAF50" : "#cccccc")};
`;
