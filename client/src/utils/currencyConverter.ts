import { api } from "./api";

interface CurrencyInfo {
  amountInKrw: number;
  currency: string;
}

interface CurrencyResponse {
  code: number;
  message: string;
  data: {
    amountInForeignCurrency: string;
    amountInKrw: string;
    exchangeRate: string;
    lastUpdated: string;
    pointAmount: number;
    rawAmountInForeignCurrency: number;
  };
}

export const getCurrencyInfo = async ({
  amountInKrw,
  currency,
}: CurrencyInfo) => {
  try {
    const response = await api.post<CurrencyResponse>(
      "/api/payment/global/info",
      {
        amountInKrw,
        currency,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Currency conversion error:", error);
    throw error;
  }
};
