import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { Currency } from '../types/currency';
import { useApp } from '../contexts/AppContext';

interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  label: string;
  disabled?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currencies,
  selectedCurrency,
  onCurrencyChange,
  label,
  disabled = false
}) => {
  const { t, isDark } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sort currencies with MZN first, then alphabetically
  const sortedCurrencies = [...currencies].sort((a, b) => {
    if (a.code === 'MZN') return -1;
    if (b.code === 'MZN') return 1;
    return a.code.localeCompare(b.code);
  });

  const filteredCurrencies = sortedCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (currency: Currency) => {
    onCurrencyChange(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getCurrencyIcon = (code: string) => {
    // Special styling for MZN (Metical) - Mozambique flag colors
    if (code === 'MZN') {
      return (
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
          MT
        </div>
      );
    }
    
    // Default styling for other currencies
    return (
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
        {code.slice(0, 2)}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={`block text-sm font-medium mb-2 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full border rounded-xl px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
          disabled 
            ? isDark
              ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-600'
              : 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300'
            : isDark
              ? 'bg-gray-800 border-gray-600 text-white focus:ring-green-500 focus:border-green-500 hover:border-gray-500'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getCurrencyIcon(selectedCurrency.code)}
            <div>
              <div className={`font-medium flex items-center space-x-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span>{selectedCurrency.code}</span>
                {selectedCurrency.code === 'MZN' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Principal
                  </span>
                )}
              </div>
              <div className={`text-sm truncate ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {selectedCurrency.name}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-2 w-full border rounded-xl shadow-lg max-h-80 overflow-hidden ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`p-3 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchCurrencies}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500 focus:border-green-500'
                }`}
              />
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleSelect(currency)}
                  className={`w-full px-4 py-3 text-left focus:outline-none transition-colors duration-150 ${
                    currency.code === 'MZN' 
                      ? isDark 
                        ? 'bg-green-900/20 hover:bg-green-900/30 focus:bg-green-900/30' 
                        : 'bg-green-50 hover:bg-green-100 focus:bg-green-100'
                      : isDark 
                        ? 'hover:bg-gray-700 focus:bg-gray-700' 
                        : 'hover:bg-gray-50 focus:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCurrencyIcon(currency.code)}
                      <div>
                        <div className={`font-medium flex items-center space-x-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          <span>{currency.code}</span>
                          {currency.code === 'MZN' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {currency.name}
                        </div>
                      </div>
                    </div>
                    {selectedCurrency.code === currency.code && (
                      <Check className={`w-5 h-5 ${
                        isDark ? 'text-green-400' : 'text-green-500'
                      }`} />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className={`px-4 py-8 text-center ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {t.noCurrenciesFound}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};