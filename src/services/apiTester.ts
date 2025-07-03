import { ApiTestResult } from '../types/api';

const API_BASE_URL = 'https://metical-converter.israelmatusse.com';

class ApiTesterService {
  async testEndpoint(
    method: string,
    path: string,
    parameters: Record<string, any> = {}
  ): Promise<ApiTestResult> {
    const startTime = Date.now();
    
    try {
      let url = `${API_BASE_URL}${path}`;
      let requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Handle different HTTP methods
      if (method === 'GET') {
        // Add query parameters to URL
        const queryParams = new URLSearchParams();
        Object.entries(parameters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      } else {
        // Add parameters to request body
        requestOptions.body = JSON.stringify(parameters);
      }

      const response = await fetch(url, requestOptions);
      const duration = Date.now() - startTime;
      
      let data;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }

      return {
        success: response.ok,
        status: response.status,
        data,
        timestamp: new Date().toISOString(),
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        duration
      };
    }
  }

  async testMultipleEndpoints(tests: Array<{
    method: string;
    path: string;
    parameters: Record<string, any>;
    name: string;
  }>): Promise<Array<ApiTestResult & { name: string }>> {
    const results = [];
    
    for (const test of tests) {
      const result = await this.testEndpoint(test.method, test.path, test.parameters);
      results.push({ ...result, name: test.name });
      
      // Small delay between requests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Specific methods for the real API endpoints
  async testGetCurrencies(): Promise<ApiTestResult> {
    return this.testEndpoint('GET', '/api/v1/currencies');
  }

  async testExchangeQuote(from: string, to: string, amount: number): Promise<ApiTestResult> {
    return this.testEndpoint('GET', '/api/v1/exchange/quote', { from, to, amount });
  }

  async testExchangeRates(): Promise<ApiTestResult> {
    return this.testEndpoint('GET', '/api/v1/exchange-rates');
  }

  async testExchangeRatesByCurrency(currency: string): Promise<ApiTestResult> {
    return this.testEndpoint('GET', `/api/v1/exchange-rates/${currency}`);
  }

  async testSellMetical(amount: number, currency: string): Promise<ApiTestResult> {
    return this.testEndpoint('GET', '/api/v1/sell-metical', { amount, currency });
  }

  async testSellForeignCurrency(amount: number, currency: string): Promise<ApiTestResult> {
    return this.testEndpoint('GET', '/api/v1/sell-foreign-currency', { amount, currency });
  }

  async testBuyForeignCurrency(amount: number, currency: string): Promise<ApiTestResult> {
    return this.testEndpoint('GET', '/api/v1/buy-foreign-currency', { amount, currency });
  }
}

export const apiTester = new ApiTesterService();