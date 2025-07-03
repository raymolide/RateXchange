import React from 'react';
import { Globe, Monitor, Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { languages } from '../types/language';

export const ThemeLanguageControls: React.FC = () => {
  const { theme, setTheme, language, setLanguage, t, isDark } = useApp();

  const themeOptions = [
    { value: 'light' as const, icon: Sun, color: 'text-yellow-500' },
    { value: 'dark' as const, icon: Moon, color: 'text-blue-500' },
    { value: 'system' as const, icon: Monitor, color: 'text-gray-500' }
  ];

  const getCurrentThemeIcon = () => {
    const currentTheme = themeOptions.find(option => option.value === theme);
    const Icon = currentTheme?.icon || Monitor;
    return <Icon className={`w-5 h-5 ${currentTheme?.color || 'text-gray-500'}`} />;
  };

  const getCurrentLanguageFlag = () => {
    const currentLang = languages.find(lang => lang.code === language);
    return currentLang?.flag || '🌐';
  };

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Language Toggle */}
      <div className="relative group">
        <button
          onClick={toggleLanguage}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
              : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm'
          }`}
          title={`${t.language}: ${language === 'en' ? 'English' : 'Português'}`}
        >
          <span className="text-lg">{getCurrentLanguageFlag()}</span>
          <span className="text-sm font-medium hidden sm:block">
            {language.toUpperCase()}
          </span>
          <Globe className="w-4 h-4" />
        </button>
        
        {/* Language Tooltip */}
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap ${
          isDark ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'
        }`}>
          {language === 'en' ? 'Mudar para Português' : 'Switch to English'}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="relative group">
        <button
          onClick={cycleTheme}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
              : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm'
          }`}
          title={`${t.theme}: ${themeOptions.find(opt => opt.value === theme)?.value || 'system'}`}
        >
          {getCurrentThemeIcon()}
          <span className="text-sm font-medium hidden sm:block">
            {theme === 'light' ? t.light : theme === 'dark' ? t.dark : t.system}
          </span>
        </button>
        
        {/* Theme Tooltip */}
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap ${
          isDark ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'
        }`}>
          {theme === 'light' && (language === 'en' ? 'Switch to Dark' : 'Mudar para Escuro')}
          {theme === 'dark' && (language === 'en' ? 'Switch to System' : 'Mudar para Sistema')}
          {theme === 'system' && (language === 'en' ? 'Switch to Light' : 'Mudar para Claro')}
        </div>
      </div>
    </div>
  );
};