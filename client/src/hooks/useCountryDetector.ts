import { useState, useEffect } from "react";
import axios from "axios";

interface CountryInfo {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  ip: string;
}

export const useCountryDetector = () => {
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        const data = response.data;

        setCountryInfo({
          country: data.country_name,
          countryCode: data.country_code,
          city: data.city,
          region: data.region,
          ip: data.ip,
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { countryInfo, isLoading, error };
};
