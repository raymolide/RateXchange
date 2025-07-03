import React from 'react';
import { History, ArrowUpDown, Clock } from 'lucide-react';
import { ConversionHistory as ConversionHistoryType } from '../types/currency';
import { useApp } from '../contexts/AppContext';

interface ConversionHistoryProps {
  history: ConversionHistoryType[];
  onClearHistory: () => void;
}

export const ConversionHistory: React.FC<ConversionHistoryProps> = ({
  history,
  onClearHistory
}) => {
  const { t, isDark } = useApp();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(num);
  };

  if (history.length === 0) {
    return (
      <div className={`rounded-2xl p-6 border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="text-center">
          <History className={`w-12 h-12 mx-auto mb-3 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-lg font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {t.noConversionHistory}
          </p>
          <p className={`text-sm mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {t.recentConversionsAppear}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 border ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <History className={`w-5 h-5 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {t.recentConversions}
          </h3>
        </div>
        
        <button
          onClick={onClearHistory}
          className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
        >
          {t.clearAll}
        </button>
      </div>

      <div className="space-y-3">
        {history.slice(0, 5).map((conversion) => (
          <div
            key={conversion.id}
            className={`flex items-center justify-between p-3 rounded-xl transition-colors duration-150 ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <ArrowUpDown className="w-4 h-4 text-white" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatNumber(conversion.amount)} {conversion.from.code}
                  </span>
                  <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                    →
                  </span>
                  <span className={`font-medium ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {formatNumber(conversion.result)} {conversion.to.code}
                  </span>
                </div>
                
                <div className={`flex items-center space-x-2 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(conversion.timestamp)}</span>
                  <span>•</span>
                  <span>Rate: {formatNumber(conversion.rate)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length > 5 && (
        <div className="mt-4 text-center">
          <p className={`text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {t.showingOf} 5 {t.of} {history.length} {t.conversions}
          </p>
        </div>
      )}
    </div>
  );
};