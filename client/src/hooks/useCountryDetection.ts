// hooks/useCountryDetection.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CountryInfo, CountryResponse } from "../types/country";
import { api } from "../utils/api";

const DEFAULT_COUNTRY_INFO: CountryInfo = {
  country: "unknown",
  language: "en",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export const useCountryDetection = () => {
  const { i18n } = useTranslation();
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const detectCountry = async () => {
      setLoading(true);
      try {
        const response = await api.get("/user-country");
        const { success, data }: CountryResponse = await response.data;

        if (success && data.language) {
          try {
            await i18n.changeLanguage(data.language);
          } catch (langError) {
            console.warn("Language change failed:", langError);
          }
          setCountryInfo(data);
        }
      } catch (error) {
        console.error("Failed to detect country:", error);
        setError(
          error instanceof Error ? error : new Error("Failed to detect country")
        );
        setCountryInfo({
          ...DEFAULT_COUNTRY_INFO,
          language: i18n.language || DEFAULT_COUNTRY_INFO.language,
        });
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, [i18n]);

  return {
    countryInfo,
    error,
    loading,
    safeCountryInfo: countryInfo || {
      ...DEFAULT_COUNTRY_INFO,
      language: i18n.language || DEFAULT_COUNTRY_INFO.language,
    },
  };
};
