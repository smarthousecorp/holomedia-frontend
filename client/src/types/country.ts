// types/country.ts
export interface CountryInfo {
  country: string;
  language: string;
  timezone: string;
}

export interface CountryResponse {
  success: boolean;
  data: CountryInfo;
}
