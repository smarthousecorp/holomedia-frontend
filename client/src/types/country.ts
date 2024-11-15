export interface CountryInfo {
  countryCode: string;
  language: string;
  region: string;
  timezone: string;
}

export interface CountryResponse {
  success: boolean;
  data: CountryInfo;
  error?: string;
}
