import styled from "styled-components";
import {useTranslation} from "react-i18next";

interface SocialProps {
  auth: string;
}

const Social = ({auth}: SocialProps) => {
  const {t} = useTranslation();

  return (
    <SocialContainer>
      <TitleDiv>
        {auth === "login"
          ? t("auth.social.loginTitle", "SNS 간편 로그인")
          : t("auth.social.signupTitle", "SNS 간편 회원가입")}
      </TitleDiv>
      <IconUl>
        <IconLi>
          <img
            src="/Naver.svg"
            alt={t("auth.social.naverAlt", "네이버 아이콘")}
          />
        </IconLi>
        <IconLi>
          <img
            src="/Google.svg"
            alt={t("auth.social.googleAlt", "구글 아이콘")}
          />
        </IconLi>
        <IconLi>
          <img
            src="/Kakao.png"
            alt={t("auth.social.kakaoAlt", "카카오 아이콘")}
          />
        </IconLi>
      </IconUl>
    </SocialContainer>
  );
};

export default Social;

const SocialContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  border-top: 1px solid #adadad;
  border-bottom: 1px solid #adadad;
  padding: 2.5rem 0;
`;

const TitleDiv = styled.div`
  position: absolute;
  bottom: 7rem;
  font-family: "Pretendard-Bold";
  font-size: 1.4rem;
  width: 13rem;
  text-align: center;
  background-color: white;
`;

const IconUl = styled.ul`
  display: flex;
  gap: 2.5rem;
`;

const IconLi = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.8rem;
  height: 2.8rem;

  > img {
    width: 100%;
  }
`;
