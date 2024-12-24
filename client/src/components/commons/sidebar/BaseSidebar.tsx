// BaseSidebar.tsx
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/logo_test.png";
import homeIcon from "../../../assets/home.png";
import alarmIcon from "../../../assets/alarm.png";
import settingIcon from "../../../assets/setting.png";
// import starIcon from "../../../assets/star.png";
import { SvgIcon } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import LanguageSwitcher from "../LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import GgulImg from "../../../assets/Ggul.png";
import { getCookie } from "../../../utils/cookie";
import PaymentModal from "../../main/PaymentModal";

interface BaseSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: "default" | "mobile";
  className?: string; // Allow styled-components to pass className
}

const BaseSidebar = ({
  isOpen,
  onClose,
  variant = "default",
  className,
}: BaseSidebarProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);
  const isLogin = getCookie("accessToken");

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const handleClickChargeBtn = () => {
    setShowPaymentModal(true);
  };

  useEffect(() => {
    const handleLanguageChange = () => {
      onClose?.();
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n, onClose]);

  return (
    <>
      <SidebarContainer
        className={className}
        $variant={variant}
        $isOpen={isOpen}
        onClick={(e) => e.stopPropagation()}
      >
        <ContentWrapper $variant={variant}>
          <Logo>
            <img
              src={logo}
              alt="로고"
              onClick={() => navigate(isLogin ? "/main" : "/")}
            />
            {variant === "mobile" && (
              <SvgIcon
                className="delete"
                component={ClearIcon}
                onClick={onClose}
              />
            )}
          </Logo>
          <Profile>
            <ProfileLeft>
              <img src={user.profile_image} alt="프로필 사진" />
            </ProfileLeft>
            <ProfileRight>
              <h5>{user.username}</h5>
              <p>@{user.user_id}</p>
            </ProfileRight>
          </Profile>
          <Bloom>
            <img src={GgulImg} alt="bloom 아이콘" />
            <BloomText>{user.bloom}</BloomText>
            <SelectButton onClick={handleClickChargeBtn}>
              <ButtonText>충전하기</ButtonText>
            </SelectButton>
          </Bloom>
          <LanguageSwitcherWrapper>
            <LanguageSwitcher />
          </LanguageSwitcherWrapper>
          <NavList>
            <SidebarLi
              onClick={() => {
                navigate("/main");
              }}
            >
              <img src={homeIcon} alt="홈" />
              <p>{t("sidebar.home")}</p>
            </SidebarLi>
            <SidebarLi
              onClick={() => {
                navigate("/alarm");
              }}
            >
              <img src={alarmIcon} alt="알림" />
              <p>{t("sidebar.alarm")}</p>
            </SidebarLi>
            {/* <SidebarLi
            onClick={() => {
              navigate("/membership");
            }}
          >
            <img src={starIcon} alt="멤버십" />
            <p>{t("sidebar.membership")}</p>
          </SidebarLi> */}
            <SidebarLi
              onClick={() => {
                navigate("/settings");
              }}
            >
              <img src={settingIcon} alt="설정" />
              <p>{t("sidebar.setting")}</p>
            </SidebarLi>
          </NavList>
        </ContentWrapper>
        <Footer $variant={variant}>
          <FooterLinks>
            <FooterRow>
              <FooterLink href="/terms">홀로미디어 이용약관</FooterLink>
              {/* <FooterDivider>|</FooterDivider> */}
              <FooterLink href="/privacy">개인정보처리방침</FooterLink>
            </FooterRow>
            <FooterRow>
              <FooterLink href="/protection">청소년 보호정책</FooterLink>
              {/* <FooterDivider>|</FooterDivider> */}
              <FooterLink href="/business">사업자 이용약관</FooterLink>
            </FooterRow>
          </FooterLinks>
          <BusinessInfo>
            <BusinessText>
              홀로미디어(주) &nbsp;&nbsp;&nbsp;대표이사: 차윤태
            </BusinessText>
            <BusinessText>사업자등록번호: 256-81-03803</BusinessText>
            <BusinessText>
              인천광역시 연수구 인천타워대로 323, 에이동 3012-40호
            </BusinessText>
            <Copyright>©HOLOMEDIA All Rights Reserved.</Copyright>
          </BusinessInfo>
        </Footer>
      </SidebarContainer>
      {showPaymentModal && (
        <PaymentModal
          onClose={() => {
            setShowPaymentModal(false);
          }}
        />
      )}
    </>
  );
};

export default BaseSidebar;

const SidebarContainer = styled.nav<{
  $variant: "default" | "mobile";
  $isOpen?: boolean;
}>`
  width: 35rem;
  background-color: #ffffff;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;

  ${({ $variant, $isOpen }) =>
    $variant === "mobile" &&
    css`
      width: 26rem;
      position: fixed;
      top: 0;
      height: 100vh;
      right: -26rem;
      transition: left 0.35s ease;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
      z-index: 999;

      @media (min-width: 900px) {
        display: none;
      }

      ${$isOpen &&
      css`
        right: 0;
      `}
    `}
`;

const ContentWrapper = styled.div<{
  $variant: "default" | "mobile";
}>`
  margin: 0 4rem 0 5rem;
  flex: 1;

  ${({ $variant }) =>
    $variant === "mobile" &&
    css`
      margin: 0 1rem 0 2rem;
    `}
`;

const Logo = styled.div`
  height: 8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > svg {
    position: relative;
    right: 5px;
    font-size: 2.4rem;
    color: #5e5d5d;
  }

  > img {
    width: 16rem;
  }

  @media (max-width: 900px) {
    height: 6rem;

    > img {
      width: 12rem;
    }
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const ProfileLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  > h5 {
    color: #000000;
    font-size: 1.4rem;
  }

  > p {
    font-size: 1rem;
    color: #918994;
  }
`;

const NavList = styled.ul`
  font-family: "Pretendard-Bold";
  position: relative;
  margin: 0;
  padding: 0;
`;

const LanguageSwitcherWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const SidebarLi = styled.li`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
  padding: 1.5rem 0;
  cursor: pointer;
  color: #000000;
  transition: all 0.2s ease-in-out;
  position: relative;

  > img {
    width: 2rem;
  }
`;

const Bloom = styled.div`
  width: 21rem;
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  gap: 1rem;
  align-items: center;
  position: relative;
  color: #eb3553;
  border-radius: 11px;
  padding-left: 1rem;
  margin-bottom: 1rem;
`;

const SelectButton = styled.button`
  max-width: 60px;
  white-space: nowrap;
  flex: 0.5;
  background-color: #eb3553;
  color: #ffffff;
  border: none;
  border-radius: 0 11px 11px 0;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5627b;
  }
`;

const BloomText = styled.p`
  font-family: "Pretendard-Bold";
  font-weight: 600;
  font-size: 1.5rem;
  flex: 1;
`;

const ButtonText = styled.span`
  font-family: "Pretendard-Bold";
  font-size: 1.2rem;
`;

// 푸터 스타일

const Footer = styled.footer<{
  $variant: "default" | "mobile";
}>`
  padding: 2.3rem;
  margin: 2rem;
  margin-top: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fbfbfb;

  ${({ $variant }) =>
    $variant === "mobile" &&
    css`
      padding: 2rem;
      margin: 1.5rem;
    `}
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
`;

const FooterLink = styled.a`
  color: #ff627c;
  font-size: 1.15rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #ee3e5b;
  }
`;

// const FooterDivider = styled.span`
//   color: #ddd;
//   font-size: 1.2rem;
//   text-align: center;
//   flex-grow: 1;  // This ensures divider stays in the center
// `;

const BusinessInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const BusinessText = styled.p`
  color: #999;
  font-size: 1.1rem;
  line-height: 1.4;
`;

const Copyright = styled.p`
  color: #999;
  font-size: 1.1rem;
  margin-top: 0.8rem;
`;
