export interface Currency {
  code: string;
  name: string;
  symbol?: string;
}

export interface ConversionRate {
  from: string;
  to: string;
  rate: number;
  amount: number;
  result: number;
  timestamp: string;
}

export interface ConversionHistory {
  id: string;
  from: Currency;
  to: Currency;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Real API response types based on the documentation
export interface CurrencyResponse {
  currency: string;
  location: string;
  name: string;
}

export interface ConversionDetails {
  inputAmount: number;
  inputCurrency: string;
  outputAmount: number;
  outputCurrency: string;
  exchangeRate: number;
  operationType: 'SELL_FOREIGN_TO_MZN' | 'CROSS_CURRENCY' | 'SELL_MZN_FOR_FOREIGN';
}

export interface ExchangeRateInfo {
  baseCurrency: string;
  location: string;
  name: string;
  type: string;
  date: string;
  lastUpdate: string;
}

export interface CurrencyConversionResponse {
  exchangeInfo: ExchangeRateInfo;
  conversion: ConversionDetails;
  description: string;
}

export interface RateResponse {
  currency: string;
  location: string;
  name: string;
  lastUpdate: string;
  buy: number;
  sell: number;
}

export interface ExchangeRateResponse {
  baseCurrency: string;
  location: string;
  name: string;
  type: string;
  date: string;
  lastUpdate: string;
  rates: RateResponse[];
}

export interface ApiResponseWrapper<T> {
  message: string;
  data: T;
}