export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;
  liveRates: string;
  updatedNow: string;

  // Navigation
  converter: string;
  apiTester: string;

  // Main content
  convertTitle: string;
  convertSubtitle: string;

  // Converter
  currencyConverter: string;
  from: string;
  to: string;
  amount: string;
  enterAmount: string;
  enterAmountPlaceholder: string;
  converting: string;
  enterAmountToSee: string;
  realTimeRates: string;
  youGet: string;
  exchangeRate: string;
  liveRate: string;

  // History
  recentConversions: string;
  noConversionHistory: string;
  recentConversionsAppear: string;
  clearAll: string;
  showingOf: string;
  of: string;
  conversions: string;

  // Search
  searchCurrencies: string;
  noCurrenciesFound: string;

  // Settings
  settings: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
  system: string;

  // Footer
  about: string;
  aboutDescription: string;
  features: string;
  featuresList: string[];
  currencyCoverage: string;
  currencyDescription: string;
  footerCopyright: string;

  // Errors
  conversionFailed: string;
  errorOccurred: string;
}

export const translations: Record<string, Translations> = {
  en: {
    appTitle: "Metical Converter",
    appSubtitle: "Real-time currency exchange rates",
    liveRates: "Live Rates",
    updatedNow: "Updated now",
    converter: "Converter",
    apiTester: "API Tester",
    convertTitle: "Convert Mozambican Metical",
    convertSubtitle: "Get real-time exchange rates for the Mozambican Metical and other world currencies. Fast, accurate, and always up-to-date.",
    currencyConverter: "Currency Converter",
    from: "From",
    to: "To",
    amount: "Amount",
    enterAmount: "Enter amount",
    enterAmountPlaceholder: "Enter amount to convert",
    converting: "Converting...",
    enterAmountToSee: "Enter an amount to see conversion",
    realTimeRates: "Real-time exchange rates",
    youGet: "You get",
    exchangeRate: "Exchange rate",
    liveRate: "Live rate",
    recentConversions: "Recent Conversions",
    noConversionHistory: "No conversion history",
    recentConversionsAppear: "Your recent conversions will appear here",
    clearAll: "Clear All",
    showingOf: "Showing",
    of: "of",
    conversions: "conversions",
    searchCurrencies: "Search currencies...",
    noCurrenciesFound: "No currencies found",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    about: "About",
    aboutDescription: "Professional currency converter providing real-time exchange rates for Mozambican Metical and major world currencies using live API data.",
    features: "Features",
    featuresList: [
      "Real-time exchange rates from API",
      "Multiple currency support",
      "Conversion history",
      "Mobile-friendly design",
      "Dark mode support",
      "API testing suite"
    ],
    currencyCoverage: "Currency Coverage",
    currencyDescription: "Supporting all currencies available through the Metical Converter API with live market rates.",
    footerCopyright: "© 2025 Metical Converter. Professional currency conversion service.",
    conversionFailed: "Failed to convert currency. Please try again.",
    errorOccurred: "An error occurred during conversion."
  },
  pt: {
    appTitle: "Conversor de Metical",
    appSubtitle: "Taxas de câmbio em tempo real",
    liveRates: "Taxas ao Vivo",
    updatedNow: "Actualizado agora",
    converter: "Conversor",
    apiTester: "Testador de API",
    convertTitle: "Converter Metical Moçambicano",
    convertSubtitle: "Obtenha taxas de câmbio em tempo real para o Metical Moçambicano e outras moedas mundiais. Rápido, preciso e sempre actualizado.",
    currencyConverter: "Conversor de Moedas",
    from: "De",
    to: "Para",
    amount: "Quantia",
    enterAmount: "Inserir quantia",
    enterAmountPlaceholder: "Inserir quantia para converter",
    converting: "A converter...",
    enterAmountToSee: "Insira uma quantia para ver a conversão",
    realTimeRates: "Taxas de câmbio em tempo real",
    youGet: "Recebe",
    exchangeRate: "Taxa de câmbio",
    liveRate: "Taxa ao vivo",
    recentConversions: "Conversões Recentes",
    noConversionHistory: "Sem histórico de conversões",
    recentConversionsAppear: "As suas conversões recentes aparecerão aqui",
    clearAll: "Limpar Tudo",
    showingOf: "A mostrar",
    of: "de",
    conversions: "conversões",
    searchCurrencies: "Pesquisar moedas...",
    noCurrenciesFound: "Nenhuma moeda encontrada",
    settings: "Definições",
    language: "Idioma",
    theme: "Tema",
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
    about: "Sobre",
    aboutDescription: "Conversor de moedas profissional que fornece taxas de câmbio em tempo real para o Metical Moçambicano e principais moedas mundiais utilizando dados da API ao vivo.",
    features: "Funcionalidades",
    featuresList: [
      "Taxas de câmbio em tempo real da API",
      "Suporte a múltiplas moedas",
      "Histórico de conversões",
      "Design responsivo",
      "Suporte ao modo escuro",
      "Suite de testes da API"
    ],
    currencyCoverage: "Cobertura de Moedas",
    currencyDescription: "Suportando todas as moedas disponíveis através da API do Conversor de Metical com taxas de mercado ao vivo.",
    footerCopyright: "© 2025 Conversor de Metical. Serviço profissional de conversão de moedas.",
    conversionFailed: "Falha ao converter moeda. Tente novamente.",
    errorOccurred: "Ocorreu um erro durante a conversão."
  }
};

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];