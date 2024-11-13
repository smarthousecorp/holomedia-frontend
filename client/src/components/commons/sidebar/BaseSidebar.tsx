// BaseSidebar.tsx
import {ReactNode, useEffect, useState} from "react";
import styled, {css} from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {RootState} from "../../../store";
import {api} from "../../../utils/api";
import {setViewMode, ViewMode} from "../../../store/slices/view";
import LanguageSwitcher from "../LanguageSwitcher";

interface BaseSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: "default" | "hamburger";
  className?: string; // Allow styled-components to pass className
  children?: ReactNode;
}

const BaseSidebar = ({
  isOpen,
  onClose,
  variant = "default",
  className,
  children,
}: BaseSidebarProps) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const {currentMode, currentUploader} = useSelector(
    (state: RootState) => state.view
  );
  const [uploaders, setUploaders] = useState([]);

  useEffect(() => {
    const fetchUploaderData = async () => {
      try {
        const response = await api.get(`/media/uploaders`);
        const uploadersData = response.data.data;
        setUploaders(uploadersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUploaderData();
  }, []);

  useEffect(() => {
    const handleLanguageChange = () => {
      onClose?.();
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n, onClose]);

  const handleModeChange = (mode: ViewMode, uploader?: string) => {
    dispatch(setViewMode({mode, uploader}));
  };

  return (
    <SidebarContainer className={className} $variant={variant} $isOpen={isOpen}>
      <ContentWrapper>
        {children}
        <NavList>
          <SidebarLi
            $isSelected={currentMode === "new" && !currentUploader}
            onClick={() => handleModeChange("new")}
          >
            {t("sidebar.new")}
          </SidebarLi>
          <SidebarLi
            $isSelected={currentMode === "best" && !currentUploader}
            onClick={() => handleModeChange("best")}
          >
            {t("sidebar.realTimeBest")}
          </SidebarLi>
          {uploaders.map((uploader) => (
            <SidebarLi
              key={uploader}
              $isSelected={currentUploader === uploader}
              onClick={() => handleModeChange("weekly", uploader)}
            >
              {uploader}
            </SidebarLi>
          ))}
        </NavList>
      </ContentWrapper>
      <LanguageSwitcherWrapper>
        <LanguageSwitcher />
      </LanguageSwitcherWrapper>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.nav<{
  $variant: "default" | "hamburger";
  $isOpen?: boolean;
}>`
  position: fixed;
  top: 8rem;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 25rem;
  background-color: #000000;
  color: white;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 8rem);

  ${({$variant, $isOpen}) =>
    $variant === "hamburger" &&
    css`
      top: 0;
      height: 100vh;
      left: -25rem;
      transition: left 0.35s ease;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);

      ${$isOpen &&
      css`
        left: 0;
      `}
    `}
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const NavList = styled.ul`
  position: relative;
  margin: 0;
  padding: 0;
`;

const LanguageSwitcherWrapper = styled.div`
  border-top: 1px solid white;
  padding: 1.5rem;
  background-color: #000000;
`;

const SidebarLi = styled.li<{$isSelected: boolean}>`
  text-align: center;
  font-size: 1.8rem;
  padding: 1.5rem 0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;

  ${({$isSelected}) =>
    $isSelected &&
    css`
      color: #ff627c;
      background-color: rgba(255, 98, 124, 0.1);
      font-weight: 500;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background-color: #ff627c;
      }

      &:hover {
        background-color: rgba(255, 98, 124, 0.15);
      }
    `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default BaseSidebar;
