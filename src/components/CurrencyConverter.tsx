import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowUpDown, AlertCircle, Loader } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { AmountInput } from './AmountInput';
import { ConversionResult } from './ConversionResult';
import { ConversionHistory } from './ConversionHistory';
import { currencyApi } from '../services/currencyApi';
import { Currency, ConversionHistory as ConversionHistoryType } from '../types/currency';
import { useApp } from '../contexts/AppContext';

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

export const CurrencyConverter: React.FC = () => {
  const { t, isDark } = useApp();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [fromCurrency, setFromCurrency] = useState<Currency>({ code: 'MZN', name: 'Mozambican Metical' });
  const [toCurrency, setToCurrency] = useState<Currency>({ code: 'USD', name: 'US Dollar' });
  const [amount, setAmount] = useState<string>('1000');
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<ConversionHistoryType[]>([]);

  useEffect(() => {
    loadCurrencies();
    loadHistoryFromStorage();
  }, []);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const delayTimer = setTimeout(() => {
        performConversion();
      }, 500);

      return () => clearTimeout(delayTimer);
    } else {
      setConversionData(null);
    }
  }, [fromCurrency, toCurrency, amount]);

  const loadCurrencies = async () => {
    setIsLoadingCurrencies(true);
    try {
      const currencyList = await currencyApi.getCurrencies();
      
      // Ensure MZN is always first in the list
      const sortedCurrencies = currencyList.sort((a, b) => {
        if (a.code === 'MZN') return -1;
        if (b.code === 'MZN') return 1;
        return a.code.localeCompare(b.code);
      });
      
      setCurrencies(sortedCurrencies);
      
      // Set default currencies with MZN as primary
      const mzn = sortedCurrencies.find(c => c.code === 'MZN');
      const usd = sortedCurrencies.find(c => c.code === 'USD');
      
      if (mzn) setFromCurrency(mzn);
      if (usd) setToCurrency(usd);
      
    } catch (err) {
      console.error('Failed to load currencies:', err);
      setError(t.errorOccurred + ' Falha ao carregar moedas da API.');
    } finally {
      setIsLoadingCurrencies(false);
    }
  };

  const loadHistoryFromStorage = () => {
    try {
      const stored = localStorage.getItem('conversion-history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const saveHistoryToStorage = (newHistory: ConversionHistoryType[]) => {
    try {
      localStorage.setItem('conversion-history', JSON.stringify(newHistory));
    } catch (err) {
      console.error('Failed to save history:', err);
    }
  };

  const performConversion = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setError('');

    try {
      const conversion = await currencyApi.convertCurrencyWithDetails(
        fromCurrency.code,
        toCurrency.code,
        parseFloat(amount)
      );

      if (conversion) {
        setConversionData(conversion);

        // Add to history
        const newConversion: ConversionHistoryType = {
          id: Date.now().toString(),
          from: fromCurrency,
          to: toCurrency,
          amount: parseFloat(amount),
          result: conversion.result,
          rate: conversion.rate,
          timestamp: new Date().toISOString(),
        };

        const newHistory = [newConversion, ...history.slice(0, 19)]; // Keep last 20
        setHistory(newHistory);
        saveHistoryToStorage(newHistory);
      } else {
        setError(t.conversionFailed + ' A API não retornou dados.');
      }
    } catch (err) {
      setError(t.errorOccurred + ' Verifique a sua ligação à internet.');
      console.error('Conversion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversion-history');
  };

  const refreshConversion = () => {
    if (amount && parseFloat(amount) > 0) {
      performConversion();
    }
  };

  // Quick conversion buttons for common MZN conversions
  const quickConversions = [
    { currency: 'USD', label: 'Dólar Americano' },
    { currency: 'EUR', label: 'Euro' },
    { currency: 'ZAR', label: 'Rand Sul-Africano' },
    { currency: 'GBP', label: 'Libra Esterlina' }
  ];

  const setQuickConversion = (targetCurrency: string) => {
    const currency = currencies.find(c => c.code === targetCurrency);
    if (currency) {
      setFromCurrency({ code: 'MZN', name: 'Mozambican Metical' });
      setToCurrency(currency);
    }
  };

  if (isLoadingCurrencies) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-2xl p-8 shadow-lg border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-center space-x-4">
            <Loader className={`w-8 h-8 animate-spin ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`} />
            <span className={`text-lg font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              A carregar moedas da API...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quick Conversion Buttons */}
      <div className={`rounded-2xl p-4 border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Conversões Rápidas do Metical
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickConversions.map((conv) => (
            <button
              key={conv.currency}
              onClick={() => setQuickConversion(conv.currency)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                toCurrency.code === conv.currency && fromCurrency.code === 'MZN'
                  ? isDark
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-green-600 bg-green-50 text-green-700'
                  : isDark
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">MZN → {conv.currency}</div>
              <div className={`text-xs mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {conv.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Converter Card */}
      <div className={`rounded-2xl p-6 shadow-lg border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {t.currencyConverter}
          </h2>
          <button
            onClick={refreshConversion}
            disabled={isLoading}
            className={`p-2 rounded-xl transition-colors duration-200 disabled:opacity-50 ${
              isDark 
                ? 'text-green-400 hover:bg-gray-700' 
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* From Currency */}
          <div>
            <CurrencySelector
              currencies={currencies}
              selectedCurrency={fromCurrency}
              onCurrencyChange={setFromCurrency}
              label={t.from}
              disabled={isLoading}
            />
          </div>

          {/* To Currency */}
          <div>
            <CurrencySelector
              currencies={currencies}
              selectedCurrency={toCurrency}
              onCurrencyChange={setToCurrency}
              label={t.to}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={swapCurrencies}
            disabled={isLoading}
            className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <AmountInput
            value={amount}
            onChange={setAmount}
            currency={fromCurrency.code}
            disabled={isLoading}
            placeholder={fromCurrency.code === 'MZN' ? '1000' : '100'}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 border rounded-xl ${
            isDark 
              ? 'bg-red-900/20 border-red-800/30' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className={`${
                isDark ? 'text-red-400' : 'text-red-700'
              }`}>
                {error}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Conversion Result */}
      <ConversionResult
        amount={parseFloat(amount) || 0}
        fromCurrency={fromCurrency.code}
        toCurrency={toCurrency.code}
        result={conversionData?.result || 0}
        rate={conversionData?.rate || 0}
        isLoading={isLoading}
        exchangeInfo={conversionData?.exchangeInfo}
        operationType={conversionData?.operationType}
      />

      {/* History */}
      <ConversionHistory
        history={history}
        onClearHistory={clearHistory}
      />
    </div>
  );
};