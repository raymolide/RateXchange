import React, { useState } from 'react';
import { CurrencyConverter } from './components/CurrencyConverter';
import { ApiTester } from './components/ApiTester';
import { ThemeLanguageControls } from './components/ThemeLanguageControls';
import { TrendingUp, Code } from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const { t, isDark } = useApp();
  const [activeTab, setActiveTab] = useState<'converter' | 'api-tester'>('converter');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {t.appTitle}
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.appSubtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status Indicator */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  {t.updatedNow}
                </span>
              </div>
              
              {/* Theme and Language Controls */}
              <ThemeLanguageControls />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('converter')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'converter'
                    ? isDark
                      ? 'border-green-400 text-green-400'
                      : 'border-green-600 text-green-600'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t.converter}</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('api-tester')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'api-tester'
                    ? isDark
                      ? 'border-green-400 text-green-400'
                      : 'border-green-600 text-green-600'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>{t.apiTester}</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'converter' && (
          <>
            <div className="mb-8 text-center">
              <h2 className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t.convertTitle}
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.convertSubtitle}
              </p>
            </div>
            <CurrencyConverter />
          </>
        )}

        {activeTab === 'api-tester' && <ApiTester />}
      </main>

      {/* Footer */}
      <footer className={`border-t mt-16 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t.about}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t.aboutDescription}
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t.features}
              </h3>
              <ul className={`space-y-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t.featuresList.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t.currencyCoverage}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t.currencyDescription}
              </p>
            </div>
          </div>
          
          <div className={`mt-8 pt-8 border-t text-center ${
            isDark 
              ? 'border-gray-700 text-gray-500' 
              : 'border-gray-200 text-gray-500'
          }`}>
            <p>{t.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;