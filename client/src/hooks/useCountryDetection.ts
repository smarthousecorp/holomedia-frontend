// hooks/useCountryDetection.tsx
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {CountryInfo, CountryResponse} from "../types/country";
import {api} from "../utils/api";

export const useCountryDetection = () => {
  const {i18n} = useTranslation();
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const detectCountry = async () => {
      setLoading(true);
      try {
        const response = await api.get("/user-country");

        const {success, data}: CountryResponse = await response.data;

        if (success && data.language) {
          await i18n.changeLanguage(data.language);
          setCountryInfo(data);
        }
      } catch (error) {
        console.error("Failed to detect country:", error);
        setError(
          error instanceof Error ? error : new Error("Failed to detect country")
        );
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, [i18n]);

  return {countryInfo, error, loading};
};
