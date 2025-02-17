// BaseSidebar.tsx
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/logo_test.png";
import homeIcon from "../../../assets/home.png";
import creatorIcon from "../../../assets/creator.png";
import vodIcon from "../../../assets/vod.png";
import settingIcon from "../../../assets/setting.png";
// import starIcon from "../../../assets/star.png";
import { SvgIcon } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import LanguageSwitcher from "../LanguageSwitcher";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import GgulImg from "../../../assets/Ggul.png";
import PaymentModal from "../../main/PaymentModal";
import { useUserInfo } from "../../../hooks/useUserInfo";

interface BaseSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: "default" | "mobile";
  className?: string;
  onPaymentClick: () => void; // 새로운 prop 추가
}

const BaseSidebar = ({
  isOpen,
  onClose,
  variant = "default",
  className,
  onPaymentClick,
}: BaseSidebarProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Get memberNo from global state
  const memberNo = useSelector((state: RootState) => state.user.memberNo);
  console.log("멤버번호", memberNo);

  const { userInfo, isLoading } = useUserInfo(memberNo);
  console.log(isLoading, userInfo);

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const handleClickChargeBtn = () => {
    onPaymentClick();
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
        $path={location.pathname}
        onClick={(e) => e.stopPropagation()}
      >
        <ContentWrapper $variant={variant}>
          <Logo>
            <img
              src={logo}
              alt={t("sidebar.logo.alt")}
              onClick={() => navigate("/main")}
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
              <img
                src={userInfo?.urls.profile}
                alt={t("sidebar.profile.picture")}
              />
            </ProfileLeft>
            <ProfileRight>
              <h5>{userInfo?.nickname}</h5>
              <p>@{userInfo?.loginId}</p>
            </ProfileRight>
          </Profile>
          <Bloom>
            <img src={GgulImg} alt={t("sidebar.profile.bloom.icon")} />
            <BloomText>{userInfo?.point}</BloomText>
            <SelectButton onClick={handleClickChargeBtn}>
              <ButtonText>{t("sidebar.profile.bloom.charge")}</ButtonText>
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
              <p>{t("sidebar.nav.home")}</p>
            </SidebarLi>
            <SidebarLi
              onClick={() => {
                navigate("/creators");
              }}
            >
              <img src={creatorIcon} alt="크리에이터" />
              <p>{t("sidebar.nav.creator")}</p>
            </SidebarLi>
            <SidebarLi
              onClick={() => {
                navigate("/videos");
              }}
            >
              <img src={vodIcon} alt="영상" />
              <p>{t("sidebar.nav.vod")}</p>
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
              <p>{t("sidebar.nav.setting")}</p>
            </SidebarLi>
          </NavList>
        </ContentWrapper>
        <Footer $variant={variant}>
          <FooterLinks>
            <FooterRow>
              <FooterLink href="/terms">{t("sidebar.footer.terms")}</FooterLink>
              <FooterLink href="/privacy">
                {t("sidebar.footer.privacy")}
              </FooterLink>
            </FooterRow>
            <FooterRow>
              <FooterLink href="/protection">
                {t("sidebar.footer.youth")}
              </FooterLink>
              <FooterLink href="/business">
                {t("sidebar.footer.business")}
              </FooterLink>
            </FooterRow>
          </FooterLinks>
          <BusinessInfo>
            <BusinessText>{t("sidebar.footer.info.company")}</BusinessText>
            <BusinessText>{t("sidebar.footer.info.registration")}</BusinessText>
            <BusinessText>{t("sidebar.footer.info.address")}</BusinessText>
            <Copyright>{t("sidebar.footer.info.copyright")}</Copyright>
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
  $path?: string;
}>`
  width: 35rem;
  background-color: #ffffff;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;

  /* PC video 페이지 체크 */
  /* ${({ $path }) => {
    const isVideoPath = /^\/video\/[^/]+$/.test($path || "");
    if (isVideoPath) {
      return css`
        display: none !important;
      `;
    }
  }} */

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
