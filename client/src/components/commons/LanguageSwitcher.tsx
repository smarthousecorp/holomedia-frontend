import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useState } from "react";

interface LanguageInfo {
  nativeName: string;
}

type LanguageCode = "ko" | "en" | "jp" | "zh";
type Languages = Record<LanguageCode, LanguageInfo>;

const lngs: Languages = {
  ko: { nativeName: "한국어" },
  en: { nativeName: "English" },
  jp: { nativeName: "日本語" },
  zh: { nativeName: "中國語" },
};

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getCurrentLanguage = (): LanguageCode => {
    const current = i18n.resolvedLanguage as string;
    return (
      Object.keys(lngs).includes(current) ? current : "en"
    ) as LanguageCode;
  };

  const handleLanguageClick = (lang: LanguageCode) => {
    i18n.changeLanguage(lang);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <Container $isDropdownOpen={isDropdownOpen}>
      <SelectedText>{lngs[getCurrentLanguage()].nativeName}</SelectedText>
      <SwitcherButton onClick={handleDropdownToggle}>
        <ButtonText>{t("sidebar.profile.select")}</ButtonText>
      </SwitcherButton>

      {isDropdownOpen && (
        <Dropdown>
          {(Object.keys(lngs) as LanguageCode[])
            .filter((lng) => lng !== getCurrentLanguage())
            .map((lng) => (
              <DropdownItem key={lng} onClick={() => handleLanguageClick(lng)}>
                <ItemText>{lngs[lng].nativeName}</ItemText>
              </DropdownItem>
            ))}
        </Dropdown>
      )}
    </Container>
  );
};

export default LanguageSwitcher;

const Container = styled.div<{ $isDropdownOpen: boolean }>`
  width: 21rem;
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  position: relative;
  color: #000000;
  border-radius: ${(props) =>
    props.$isDropdownOpen ? "11px 11px 0 0" : "11px"};
  padding-left: 1rem;
`;

const SwitcherButton = styled.button`
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

const SelectedText = styled.span`
  font-family: "Pretendard-Bold";
  font-weight: 600;
  font-size: 1.5rem;
  flex: 1;
`;

const ButtonText = styled.span`
  font-family: "Pretendard-Bold";
  font-size: 1.2rem;
`;

const Dropdown = styled.div`
  margin-top: 2px;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border-radius: 0 0 11px 11px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 555;
`;

const DropdownItem = styled.button`
  width: 100%;
  background-color: transparent;
  border: none;
  padding: 8px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const ItemText = styled.span`
  font-size: 14px;
`;
