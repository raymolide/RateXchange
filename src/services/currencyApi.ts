import { ApiResponse, Currency } from '../types/currency';

const API_BASE_URL = 'https://metical-converter.israelmatusse.com/api/v1';

interface ConversionData {
  rate: number;
  result: number;
  exchangeInfo?: {
    baseCurrency: string;
    location: string;
    name: string;
    type: string;
    date: string;
    lastUpdate: string;
  };
  operationType?: string;
}

class CurrencyApiService {
  private async makeRequest(endpoint: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async getCurrencies(): Promise<Currency[]> {
    const response = await this.makeRequest('/currencies');
    
    if (response.success && response.data) {
      // Handle the real API response format
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data.map((item: any) => ({
          code: item.currency,
          name: item.name
        }));
      }
    }
    
    throw new Error('Failed to load currencies from API');
  }

  async convertCurrency(from: string, to: string, amount: number): Promise<{ rate: number; result: number } | null> {
    try {
      // Use the /exchange/quote endpoint
      const response = await this.makeRequest(`/exchange/quote?from=${from}&to=${to}&amount=${amount}`);
      
      if (response.success && response.data && response.data.data) {
        const data = response.data.data;
        
        if (data.conversion) {
          const conversion = data.conversion;
          return {
            rate: conversion.exchangeRate,
            result: conversion.outputAmount
          };
        }
      }

      return null;
      
    } catch (error) {
      console.error('Currency conversion failed:', error);
      return null;
    }
  }

  async convertCurrencyWithDetails(from: string, to: string, amount: number): Promise<ConversionData | null> {
    try {
      // Use the /exchange/quote endpoint
      const response = await this.makeRequest(`/exchange/quote?from=${from}&to=${to}&amount=${amount}`);
      
      if (response.success && response.data && response.data.data) {
        const data = response.data.data;
        
        if (data.conversion && data.exchangeInfo) {
          const conversion = data.conversion;
          const exchangeInfo = data.exchangeInfo;
          
          return {
            rate: conversion.exchangeRate,
            result: conversion.outputAmount,
            exchangeInfo: {
              baseCurrency: exchangeInfo.baseCurrency,
              location: exchangeInfo.location,
              name: exchangeInfo.name,
              type: exchangeInfo.type,
              date: exchangeInfo.date,
              lastUpdate: exchangeInfo.lastUpdate
            },
            operationType: conversion.operationType
          };
        }
      }

      return null;
      
    } catch (error) {
      console.error('Currency conversion with details failed:', error);
      return null;
    }
  }

  async getExchangeRate(from: string, to: string): Promise<number | null> {
    try {
      // For getting just the rate, we can use a small amount (1) to get the rate
      const conversion = await this.convertCurrency(from, to, 1);
      return conversion ? conversion.rate : null;
    } catch (error) {
      console.error('Failed to get exchange rate:', error);
      return null;
    }
  }

  async getExchangeRates(): Promise<any> {
    try {
      const response = await this.makeRequest('/exchange-rates');
      
      if (response.success && response.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get exchange rates:', error);
      return null;
    }
  }

  async getExchangeRatesByCurrency(currency: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/exchange-rates/${currency}`);
      
      if (response.success && response.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to get exchange rates for ${currency}:`, error);
      return null;
    }
  }

  // Legacy endpoints (deprecated but still available)
  async sellMetical(amount: number, currency: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/sell-metical?amount=${amount}&currency=${currency}`);
      
      if (response.success && response.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to sell metical:', error);
      return null;
    }
  }

  async sellForeignCurrency(amount: number, currency: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/sell-foreign-currency?amount=${amount}&currency=${currency}`);
      
      if (response.success && response.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to sell foreign currency:', error);
      return null;
    }
  }

  async buyForeignCurrency(amount: number, currency: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/buy-foreign-currency?amount=${amount}&currency=${currency}`);
      
      if (response.success && response.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to buy foreign currency:', error);
      return null;
    }
  }
}

export const currencyApi = new CurrencyApiService();