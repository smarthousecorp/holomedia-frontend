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

      setError(error.response?.message || "아이디 검증에 실패했습니다.");
    }
  };

  // 본인인증 완료 처리
  const handleVerificationComplete = (
    data: VerificationData & { isVerified?: boolean }
  ) => {
    // 본인인증 팝업에서 전달받은 데이터 확인
    if (data.isVerified) {
      setCurrentStep("password-change");
      setError("");
    } else {
      setError("본인인증에 실패했습니다.");
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (!checkPassword(newPassword)) {
      setError("비밀번호는 8~15자의 영문, 숫자, 특수문자 조합이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
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
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "비밀번호 변경에 실패했습니다."
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
          <Title>비밀번호 찾기</Title>
          <SubTitle>
            {currentStep === "id-verify" && "아이디를 입력해주세요"}
            {currentStep === "nice-verify" && "본인인증을 진행해주세요"}
            {currentStep === "password-change" &&
              "새로운 비밀번호를 입력해주세요"}
          </SubTitle>
        </HeaderSection>

        {currentStep === "id-verify" && (
          <FormSection>
            <Input
              type="text"
              value={memberId}
              onChange={handleIdChange} // 변경된 부분
              placeholder="아이디를 입력하세요"
            />
            <Button onClick={handleIdVerify}>다음</Button>
          </FormSection>
        )}

        {currentStep === "nice-verify" && (
          <VerificationSection>
            <VerificationOption>
              <OptionTitle>본인명의 휴대전화로 인증</OptionTitle>
              <OptionDescription>
                본인명의로 등록된 휴대전화로 인증하여 비밀번호를 변경할 수
                있습니다.
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
              onChange={handleNewPasswordChange} // 변경된 부분
              placeholder="새 비밀번호 (8~15자 영문, 숫자, 특수문자 조합)"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange} // 변경된 부분
              placeholder="새 비밀번호 확인"
            />
            <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
          </FormSection>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Footer>
          <BackButton onClick={() => navigate("/")}>
            로그인 페이지로 돌아가기
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
