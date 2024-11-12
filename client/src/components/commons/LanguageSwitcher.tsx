import {useTranslation} from "react-i18next";

// 언어 데이터의 구조를 정의
interface LanguageInfo {
  nativeName: string;
}

// 지원되는 언어 코드를 정의
type LanguageCode = "ko" | "en" | "jp" | "zh";

// 전체 언어 데이터 객체의 타입을 정의
type Languages = Record<LanguageCode, LanguageInfo>;

const lngs: Languages = {
  ko: {nativeName: "한국어"},
  en: {nativeName: "English"},
  jp: {nativeName: "日本語"},
  zh: {nativeName: "中國語"},
};

const LanguageSwitcher = () => {
  const {i18n} = useTranslation();

  return (
    <div className="language-switcher">
      {(Object.keys(lngs) as LanguageCode[]).map((lng) => (
        <button
          key={lng}
          style={{
            fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
            margin: "0 5px",
            padding: "5px 10px",
            fontSize: "1.2rem",
          }}
          type="submit"
          onClick={() => i18n.changeLanguage(lng)}
        >
          {lngs[lng].nativeName}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
