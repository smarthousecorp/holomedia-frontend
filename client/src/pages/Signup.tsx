import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/holomedia-logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
// import axios, { AxiosError } from "axios";
import axios from "axios";
import { useSignUpValidation } from "../utils/SignUpValid";
import { Eye, EyeOff } from "lucide-react";
import { checkId, checkPassword, checkNickname } from "../utils/validCheck";
import { showToast } from "../store/slices/toast";
import { ToastType } from "../types/toast";
import Toast from "../components/commons/Toast";
import CustomCheckbox from "../components/commons/CustomCheckbox";
import NiceVerificationButton from "../components/commons/NiceVerificationButton";
import { VerificationData } from "../types/nice";
import TermsModal from "../components/commons/TermsModal";

export interface SignUp {
  [key: string]: any;
  id: string;
  password: string;
  passwordCheck: string;
  nickname: string;
  termsAgreed: boolean;
  smsAgreed: boolean;
  verificationData?: VerificationData;
}

interface ErrorMsg {
  id: string;
  password: string;
  passwordCheck: string;
  nickname: string;
}

interface SignUpRequest {
  userInfo: {
    id: string;
    password: string;
    nickname: string;
    checked: boolean;
  };
  authInfo: {
    responseno: string;
    birthdate: string;
    gender: string;
    di: string;
    mobileco: string;
    ci: string;
    receivedata: string;
    mobileno: string;
    requestno: string;
    nationalinfo: string;
    authtype: string;
    sitecode: string;
    utf8_name: string;
    enctime: string;
    name: string;
    resultcode: string;
  };
}

interface ApiResponse {
  code: number;
  data: null;
  message: string;
  timestamp: string;
}

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputVal, setInputVal] = useState<SignUp>({
    id: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    termsAgreed: false,
    smsAgreed: false,
  });

  const [errorMsg, setErrorMsg] = useState<ErrorMsg>({
    id: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  // 약관 모달 상태
  const [modalType, setModalType] = useState<"terms" | "privacy">("terms");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validationResults = useSignUpValidation(inputVal);

  // nice 인증 후 데이터의 상태
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null);

  const handleVerificationComplete = (data: VerificationData) => {
    setVerificationData(data);
  };

  const handleVerificationError = (message: string) => {
    dispatch(showToast({ message, type: "error" }));
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (name: string) => {
    setInputVal((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // 약관 모달 컨트롤
  const openModal = (type: "terms" | "privacy") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
    const msg = { id: "" };
    const { id } = inputVal;

    if (!checkId(id)) {
      msg.id = t("auth.signup.errors.idFormat");
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
    const msg = { nickname: "" };
    const { nickname } = inputVal;

    if (!checkNickname(nickname)) {
      msg.nickname = t("auth.signup.errors.usernameFormat");
    }
    setErrorMsg({ ...errorMsg, ...msg });
  };

  const onSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputVal.termsAgreed) {
      dispatch(
        showToast({
          message: "필수 약관에 동의해주세요.",
          type: "error",
        })
      );
      return;
    }

    if (!verificationData) {
      dispatch(
        showToast({
          message: "본인인증이 필요합니다.",
          type: "error",
        })
      );
      return;
    }

    // API 요청을 위한 데이터 준비
    const signupData: SignUpRequest = {
      userInfo: {
        id: inputVal.id,
        password: inputVal.password,
        nickname: inputVal.nickname,
        checked: inputVal.smsAgreed,
      },
      authInfo: {
        responseno: verificationData.responseno,
        birthdate: verificationData.birthdate,
        gender: verificationData.gender,
        di: verificationData.di,
        mobileco: verificationData.mobileco,
        ci: verificationData.ci,
        receivedata: verificationData.receivedata,
        mobileno: verificationData.mobileno,
        requestno: verificationData.requestno,
        nationalinfo: verificationData.nationalinfo,
        authtype: verificationData.authtype,
        sitecode: verificationData.sitecode,
        utf8_name: verificationData.utf8_name,
        enctime: verificationData.enctime,
        name: verificationData.name,
        resultcode: verificationData.resultcode,
      },
    };

    try {
      const response = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/signup`,
        signupData
      );

      if (response.data.code === 0) {
        Toast(ToastType.success, t("auth.signup.success"));
        dispatch(
          showToast({
            message: t("auth.signup.success"),
            type: "success",
          })
        );
        navigate("/");
        return;
      }

      const msg = { id: "", nickname: "" };

      switch (response.data.code) {
        case 1:
          msg.id = t("auth.signup.errors.duplicateId");
          break;
        case 2:
          msg.nickname = t("auth.signup.errors.duplicateUsername");
          break;
      }

      setErrorMsg({ ...errorMsg, ...msg });
    } catch (error) {
      console.log(error);
      Toast(ToastType.error, t("common.errors.unknown"));
      dispatch(
        showToast({
          message: t("common.errors.unknown"),
          type: "error",
        })
      );
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
            <InputContainer>
              <InputLabel>아이디</InputLabel>
              <InputWrapper>
                <Input
                  name="id"
                  placeholder={t("auth.signup.idPlaceholder")}
                  value={inputVal.id}
                  onChange={onChangeValues}
                  onBlur={onBlurIdInput}
                />
              </InputWrapper>
              {errorMsg.id && <ErrorMessage>{errorMsg.id}</ErrorMessage>}
            </InputContainer>

            <InputContainer>
              <InputLabel>비밀번호</InputLabel>
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
            </InputContainer>

            <InputContainer>
              <InputLabel>비밀번호 확인</InputLabel>
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
            </InputContainer>

            <InputContainer>
              <InputLabel>닉네임</InputLabel>
              <InputWrapper>
                <Input
                  name="nickname"
                  placeholder={t("auth.signup.usernamePlaceholder")}
                  value={inputVal.nickname}
                  onChange={onChangeValues}
                  onBlur={onBlurNameInput}
                />
              </InputWrapper>
              {errorMsg.nickname && (
                <ErrorMessage>{errorMsg.nickname}</ErrorMessage>
              )}
            </InputContainer>

            <NiceVerificationButton
              onVerificationComplete={handleVerificationComplete}
              onError={handleVerificationError}
              verificationType={1}
            />

            {/* <VerificationButton type="button" onClick={handleClickPaymentBtn}>
              결제하기
            </VerificationButton> */}

            {/* 약관 동의 섹션 */}
            <TermsSection>
              <CustomCheckbox
                checked={inputVal.termsAgreed}
                onChange={() => handleCheckboxChange("termsAgreed")}
                label={
                  <TermsText>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal("terms");
                      }}
                    >
                      이용약관
                    </span>{" "}
                    및{" "}
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal("privacy");
                      }}
                    >
                      개인정보처리방침
                    </span>
                    에 동의하며, 19세 이상임을 확인합니다.
                  </TermsText>
                }
              />

              <MarketingSection>
                <MarketingTitle>
                  마케팅 활용 동의 및 광고 수신 동의
                </MarketingTitle>
                <MarketingDescription>
                  서비스와 관련된 신상품 소식, 이벤트 안내, 고객 혜택 등 다양한
                  정보를 제공합니다.
                </MarketingDescription>
                <CustomCheckbox
                  checked={inputVal.smsAgreed}
                  onChange={() => handleCheckboxChange("smsAgreed")}
                  label="SMS 수신 동의 (선택)"
                />
              </MarketingSection>
            </TermsSection>

            <SignUpButton
              type="submit"
              disabled={
                !validationResults.idValid ||
                !validationResults.passwordValid ||
                !validationResults.passwordsMatch ||
                !validationResults.nicknameValid
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
      {/* 약관 모달 */}
      <TermsModal
        isOpen={isModalOpen}
        modalType={modalType}
        onClose={closeModal}
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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* margin-bottom: 1rem; */
`;

const InputLabel = styled.label`
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.3rem;
`;

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #d0d0d0;
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
  color: red;
  font-size: 1rem;
  margin-top: 0.3rem;
  text-align: left;
`;

// 약관 관련 스타일 컴포넌트

const TermsSection = styled.div`
  font-family: "Pretendard-Bold";
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1rem 0;
`;

const TermsText = styled.span`
  font-size: 1.2rem;
  line-height: 1.3;
  color: #333;

  span {
    color: #eb3553;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: #cc2b45;
    }
  }
`;

const MarketingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
`;

const MarketingTitle = styled.h4`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const MarketingDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.3;
  color: #666;
  margin-bottom: 1rem;
`;
