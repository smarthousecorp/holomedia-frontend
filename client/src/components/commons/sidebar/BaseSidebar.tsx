// BaseSidebar.tsx
import {useEffect} from "react";
import styled, {css} from "styled-components";
import {useTranslation} from "react-i18next";
import logo from "../../../assets/logo_test.png";
import homeIcon from "../../../assets/home.png";
import alarmIcon from "../../../assets/alarm.png";
import settingIcon from "../../../assets/setting.png";
import starIcon from "../../../assets/star.png";
import LanguageSwitcher from "../LanguageSwitcher";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import GgulImg from "../../../assets/Ggul.png";
import {getCookie} from "../../../utils/cookie";

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
  const {t, i18n} = useTranslation();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);
  const isLogin = getCookie("accessToken");

  const handleClickChargeBtn = () => {};

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
    <SidebarContainer className={className} $variant={variant} $isOpen={isOpen}>
      <ContentWrapper>
        <Logo>
          <img
            src={logo}
            alt="로고"
            onClick={() => navigate(isLogin ? "/main" : "/")}
          />
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
          <SidebarLi>
            <img src={homeIcon} alt="홈" />
            <p>{t("sidebar.home")}</p>
          </SidebarLi>
          <SidebarLi>
            <img src={alarmIcon} alt="알림" />
            <p>{t("sidebar.alarm")}</p>
          </SidebarLi>
          <SidebarLi>
            <img src={starIcon} alt="멤버십" />
            <p>{t("sidebar.membership")}</p>
          </SidebarLi>
          <SidebarLi>
            <img src={settingIcon} alt="설정" />
            <p>{t("sidebar.setting")}</p>
          </SidebarLi>
        </NavList>
      </ContentWrapper>
    </SidebarContainer>
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

  @media (max-width: 900px) {
    display: none;
  }

  ${({$variant, $isOpen}) =>
    $variant === "mobile" &&
    css`
      position: fixed;
      top: 0;
      height: 100vh;
      right: -25rem;
      transition: left 0.35s ease;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);

      ${$isOpen &&
      css`
        right: 0;
      `}
    `}
`;

const ContentWrapper = styled.div`
  margin: 0 4rem 0 5rem;
  flex: 1;
`;

const Logo = styled.div`
  height: 8rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  > svg {
    font-size: 2.4rem;
    color: white;
  }

  > img {
    width: 16rem;
  }

  @media (max-width: 600px) {
    margin-left: 2.7rem;
    & > img {
      width: 10rem;
    }

    & > svg {
      font-size: 2.1rem;
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
