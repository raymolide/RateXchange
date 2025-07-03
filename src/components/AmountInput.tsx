import React from 'react';
import { Hash } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  disabled?: boolean;
  placeholder?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency,
  disabled = false,
  placeholder
}) => {
  const { t, isDark } = useApp();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow only numbers and decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {t.amount}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Hash className={`h-5 w-5 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || t.enterAmount}
          className={`block w-full pl-10 pr-20 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
            disabled 
              ? isDark
                ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-600'
                : 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300'
              : isDark
                ? 'bg-gray-800 border-gray-600 text-white focus:ring-green-500 focus:border-green-500 hover:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 hover:border-gray-400'
          }`}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className={`text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {currency}
          </span>
        </div>
      </div>
    </div>
  );
};