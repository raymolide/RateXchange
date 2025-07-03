import React from 'react';
import { ArrowRight, TrendingUp, Clock, MapPin, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ExchangeInfo {
  baseCurrency: string;
  location: string;
  name: string;
  type: string;
  date: string;
  lastUpdate: string;
}

interface ConversionResultProps {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  result: number;
  rate: number;
  isLoading?: boolean;
  exchangeInfo?: ExchangeInfo;
  operationType?: string;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  amount,
  fromCurrency,
  toCurrency,
  result,
  rate,
  isLoading = false,
  exchangeInfo,
  operationType
}) => {
  const { t, isDark } = useApp();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(num);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getOperationTypeLabel = (type: string) => {
    switch (type) {
      case 'SELL_FOREIGN_TO_MZN':
        return 'Venda de Moeda Estrangeira';
      case 'SELL_MZN_FOR_FOREIGN':
        return 'Venda de Metical';
      case 'CROSS_CURRENCY':
        return 'Conversão Cruzada';
      default:
        return 'Conversão de Moeda';
    }
  };

  if (isLoading) {
    return (
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-green-900/20 border-green-800/30' 
          : 'bg-green-50 border-green-100'
      }`}>
        <div className="flex items-center justify-center space-x-4">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDark ? 'border-green-400' : 'border-green-500'
          }`}></div>
          <span className={`font-medium ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>
            {t.converting}
          </span>
        </div>
      </div>
    );
  }

  if (!result || !rate) {
    return (
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="text-center">
          <p className={`text-lg font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {t.enterAmountToSee}
          </p>
          <p className={`text-sm mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {t.realTimeRates}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main conversion result */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-green-900/20 border-green-800/30' 
          : 'bg-green-50 border-green-100'
      }`}>
        <div className="space-y-4">
          {/* Main conversion result */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`rounded-full p-2 shadow-sm ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <TrendingUp className={`w-5 h-5 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.youGet}
                </p>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatNumber(result)} {toCurrency}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t.from}
              </p>
              <p className={`text-lg font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {formatNumber(amount)} {fromCurrency}
              </p>
            </div>
          </div>

          {/* Exchange rate */}
          <div className={`rounded-xl p-4 shadow-sm ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.exchangeRate}
                </span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-green-900/30' : 'bg-green-100'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  1 {fromCurrency} = {formatNumber(rate)} {toCurrency}
                </p>
                <p className={`text-xs ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {t.liveRate}
                </p>
              </div>
            </div>
          </div>

          {/* Visual conversion flow */}
          <div className="flex items-center justify-center space-x-4 pt-2">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {fromCurrency}
              </div>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {formatNumber(amount)}
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-px bg-yellow-500"></div>
              <ArrowRight className={`w-6 h-6 mx-2 ${
                isDark ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
              <div className="w-full h-px bg-yellow-500"></div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {toCurrency}
              </div>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {formatNumber(result)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Information Details */}
      {exchangeInfo && (
        <div className={`rounded-2xl p-6 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <Info className={`w-5 h-5 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Informações da Taxa de Câmbio
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exchange Source */}
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className={`w-4 h-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Fonte da Taxa
                </span>
              </div>
              <p className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {exchangeInfo.name}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {exchangeInfo.location}
              </p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                }`}>
                  {exchangeInfo.type}
                </span>
              </div>
            </div>

            {/* Update Information */}
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className={`w-4 h-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Última Actualização
                </span>
              </div>
              <p className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {formatDateTime(exchangeInfo.lastUpdate)}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Data de referência: {formatDateTime(exchangeInfo.date)}
              </p>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Moeda base: {exchangeInfo.baseCurrency}
              </p>
            </div>
          </div>

          {/* Operation Type */}
          {operationType && (
            <div className="mt-4">
              <div className={`p-3 rounded-xl border-l-4 ${
                isDark 
                  ? 'bg-yellow-900/20 border-yellow-500' 
                  : 'bg-yellow-50 border-yellow-400'
              }`}>
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`w-4 h-4 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-yellow-400' : 'text-yellow-700'
                  }`}>
                    Tipo de Operação:
                  </span>
                  <span className={`text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getOperationTypeLabel(operationType)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Data Freshness Indicator */}
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-xs ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>
                Dados actualizados em tempo real
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};