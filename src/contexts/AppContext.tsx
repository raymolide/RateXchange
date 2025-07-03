import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Translations } from '../types/language';

type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'pt';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  isDark: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'system';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    const browserLang = navigator.language.startsWith('pt') ? 'pt' : 'en';
    return saved || browserLang;
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'system') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(shouldBeDark);
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = translations[language];

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      language,
      setLanguage,
      t,
      isDark
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};