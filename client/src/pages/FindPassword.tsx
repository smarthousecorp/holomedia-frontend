import styled from "styled-components";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../utils/api";
import logo from "../assets/holomedia-logo.png";
import NiceVerificationButton from "../components/commons/NiceVerificationButton";
import { VerificationData } from "../types/nice";
import { checkPassword } from "../utils/validCheck";

type Step = "id-verify" | "nice-verify" | "password-change";

const FindPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리
  const [currentStep, setCurrentStep] = useState<Step>("id-verify");
  const [memberId, setMemberId] = useState(location.state?.selectedId || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  //   const [isVerified, setIsVerified] = useState(false);

  // 아이디 검증
  const handleIdVerify = async () => {
    try {
      const response = await api.get("/member/forgot-password", {
        params: { memberId },
      });

      if (response.data.code === 0) {
        setCurrentStep("nice-verify");
        setError("");
      } else if (response.data.code === 1) {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response);
      setError(
        error.response?.message ||
          t("auth.findPassword.errors.idVerificationFailed")
      );
    }
  };

  // 본인인증 완료 처리
  const handleVerificationComplete = (
    data: VerificationData & { isVerified?: boolean }
  ) => {
    if (data.isVerified) {
      setCurrentStep("password-change");
      setError("");
    } else {
      setError(t("auth.findPassword.errors.verificationFailed"));
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (!checkPassword(newPassword)) {
      setError(t("auth.findPassword.errors.passwordFormat"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("auth.findPassword.errors.passwordMismatch"));
      return;
    }

    try {
      const response = await api.get("/member/forgot-password", {
        params: {
          memberId,
          newPassword,
        },
      });

      if (response.data.code === 0) {
        alert(t("auth.findPassword.success"));
        navigate("/");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          t("auth.findPassword.errors.changePasswordFailed")
      );
    }
  };

  // memberId 입력값 변경 핸들러
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberId(e.target.value);
    setError(""); // 입력값이 변경되면 에러 메시지 초기화
  };

  // 비밀번호 입력값 변경 핸들러들
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError(""); // 입력값이 변경되면 에러 메시지 초기화
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setError(""); // 입력값이 변경되면 에러 메시지 초기화
  };

  return (
    <Container>
      <FindPasswordBox>
        <Logo>
          <img src={logo} alt={t("auth.social.loginTitle")} />
        </Logo>

        <HeaderSection>
          <Title>{t("auth.findPassword.title")}</Title>
          <SubTitle>
            {currentStep === "id-verify" &&
              t("auth.findPassword.subtitle.enterId")}
            {currentStep === "nice-verify" &&
              t("auth.findPassword.subtitle.verifyIdentity")}
            {currentStep === "password-change" &&
              t("auth.findPassword.subtitle.enterNewPassword")}
          </SubTitle>
        </HeaderSection>

        {currentStep === "id-verify" && (
          <FormSection>
            <Input
              type="text"
              value={memberId}
              onChange={handleIdChange}
              placeholder={t("auth.findPassword.form.idPlaceholder")}
            />
            <Button onClick={handleIdVerify}>
              {t("auth.findPassword.form.next")}
            </Button>
          </FormSection>
        )}

        {currentStep === "nice-verify" && (
          <VerificationSection>
            <VerificationOption>
              <OptionTitle>
                {t("auth.findPassword.verification.phoneTitle")}
              </OptionTitle>
              <OptionDescription>
                {t("auth.findPassword.verification.phoneDescription")}
              </OptionDescription>
              <ButtonWrapper>
                <NiceVerificationButton
                  onVerificationComplete={handleVerificationComplete}
                  onError={(message) => setError(message)}
                  verificationType="password"
                />
              </ButtonWrapper>
            </VerificationOption>
          </VerificationSection>
        )}

        {currentStep === "password-change" && (
          <FormSection>
            <Input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder={t("auth.findPassword.form.newPasswordPlaceholder")}
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder={t(
                "auth.findPassword.form.confirmPasswordPlaceholder"
              )}
            />
            <Button onClick={handlePasswordChange}>
              {t("auth.findPassword.form.changePassword")}
            </Button>
          </FormSection>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Footer>
          <BackButton onClick={() => navigate("/")}>
            {t("auth.findPassword.backToLogin")}
          </BackButton>
        </Footer>
      </FindPasswordBox>
    </Container>
  );
};

export default FindPassword;

// 기존 스타일 컴포넌트 재사용
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const FindPasswordBox = styled.div`
  background-color: white;
  padding: 3.5rem 5.5rem;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  > img {
    width: 20rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
`;

const SubTitle = styled.h2`
  font-size: 1.4rem;
  color: #666;
  font-weight: normal;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.2rem;

  &:focus {
    outline: none;
    border-color: #eb3553;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #eb3553;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d62e48;
  }
`;

const VerificationSection = styled.div`
  margin-bottom: 2rem;
`;

const VerificationOption = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #eb3553;
    box-shadow: 0 2px 8px rgba(235, 53, 83, 0.1);
  }
`;

const OptionTitle = styled.h3`
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1rem;
`;

const OptionDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: #eb3553;
  }
`;

const ErrorMessage = styled.div`
  color: #eb3553;
  font-size: 1.2rem;
  margin-top: 1rem;
  text-align: center;
`;
