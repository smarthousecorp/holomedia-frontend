// src/components/LanguageSwitcher.jsx
import {useTranslation} from "react-i18next";

const lngs = {
  ko: {nativeName: "한국어"},
  en: {nativeName: "English"},
  jp: {nativeName: "日本語"},
  zh: {nativeName: "中國語"},
};

const LanguageSwitcher = () => {
  const {i18n} = useTranslation();

  return (
    <div className="language-switcher">
      {Object.keys(lngs).map((lng) => (
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
