import styled from "styled-components";
import logo from "../assets/holomedia-logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import NiceVerificationButton from "../components/commons/NiceVerificationButton";
import { VerificationData } from "../types/nice";

const FindAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [verificationError, setVerificationError] = useState<string>("");

  const handleVerificationComplete = (data: VerificationData) => {
    // 인증 완료 후 처리 로직
    console.log("Verification completed:", data);
  };

  // 인증 에러 메시지 설정
  const handleVerificationError = (message: string) => {
    setVerificationError(message);
  };

  return (
    <Container>
      <FindAccountBox>
        <Logo>
          <img src={logo} alt={t("auth.social.loginTitle")} />
        </Logo>
        <HeaderSection>
          <Title>아이디 찾기</Title>
          <SubTitle>아이디를 찾는 방법을 선택해주세요</SubTitle>
        </HeaderSection>
        <VerificationSection>
          <VerificationOption>
            <OptionTitle>본인명의 휴대전화로 인증</OptionTitle>
            <OptionDescription>
              본인명의로 등록된 휴대전화로 인증하여 아이디를 찾을 수 있습니다.
            </OptionDescription>
            <ButtonWrapper>
              <NiceVerificationButton
                onVerificationComplete={handleVerificationComplete}
                onError={handleVerificationError}
                verificationType={2}
              />
            </ButtonWrapper>
            {verificationError && (
              <ErrorMessage>{verificationError}</ErrorMessage>
            )}
          </VerificationOption>
        </VerificationSection>
        <Footer>
          <BackButton onClick={() => navigate("/")}>
            로그인 페이지로 돌아가기
          </BackButton>
        </Footer>
      </FindAccountBox>
    </Container>
  );
};

export default FindAccount;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const FindAccountBox = styled.div`
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
