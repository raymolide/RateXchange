import { ApiEndpoint } from '../types/api';

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'get-currencies',
    name: 'Listar Moedas Disponíveis',
    method: 'GET',
    path: '/api/v1/currencies',
    description: 'Obter lista de todas as moedas suportadas pela API',
    testCases: [
      {
        name: 'Listar todas as moedas',
        description: 'Buscar lista completa de moedas disponíveis',
        parameters: {}
      }
    ]
  },
  {
    id: 'exchange-quote',
    name: 'Cotação de Câmbio',
    method: 'GET',
    path: '/api/v1/exchange/quote',
    description: 'Calcular conversão entre moedas usando parâmetros from/to',
    parameters: [
      {
        name: 'from',
        type: 'string',
        required: true,
        description: 'Moeda de origem (ex: USD, EUR, MZN)',
        example: 'USD'
      },
      {
        name: 'to',
        type: 'string',
        required: true,
        description: 'Moeda de destino (ex: USD, EUR, MZN)',
        example: 'MZN'
      },
      {
        name: 'amount',
        type: 'number',
        required: true,
        description: 'Valor a ser convertido (mínimo 0.01)',
        example: 100
      }
    ],
    testCases: [
      {
        name: 'USD para MZN',
        description: 'Converter 100 USD para Metical Moçambicano',
        parameters: { from: 'USD', to: 'MZN', amount: 100 }
      },
      {
        name: 'EUR para MZN',
        description: 'Converter 50 EUR para Metical Moçambicano',
        parameters: { from: 'EUR', to: 'MZN', amount: 50 }
      },
      {
        name: 'MZN para USD',
        description: 'Converter 1000 MZN para Dólares Americanos',
        parameters: { from: 'MZN', to: 'USD', amount: 1000 }
      },
      {
        name: 'GBP para ZAR',
        description: 'Converter 25 GBP para Rand Sul-Africano',
        parameters: { from: 'GBP', to: 'ZAR', amount: 25 }
      },
      {
        name: 'Valor grande',
        description: 'Converter 10000 USD para MZN',
        parameters: { from: 'USD', to: 'MZN', amount: 10000 }
      },
      {
        name: 'Valor pequeno',
        description: 'Converter 1 EUR para MZN',
        parameters: { from: 'EUR', to: 'MZN', amount: 1 }
      }
    ]
  },
  {
    id: 'exchange-rates',
    name: 'Listar Taxas de Câmbio',
    method: 'GET',
    path: '/api/v1/exchange-rates',
    description: 'Obter todas as taxas de câmbio disponíveis',
    testCases: [
      {
        name: 'Todas as taxas',
        description: 'Buscar todas as taxas de câmbio disponíveis',
        parameters: {}
      }
    ]
  },
  {
    id: 'exchange-rates-by-currency',
    name: 'Taxa de Câmbio por Moeda',
    method: 'GET',
    path: '/api/v1/exchange-rates/{currency}',
    description: 'Buscar taxa de câmbio específica por moeda',
    parameters: [
      {
        name: 'currency',
        type: 'string',
        required: true,
        description: 'Código da moeda (ex: USD, EUR, GBP)',
        example: 'USD'
      }
    ],
    testCases: [
      {
        name: 'Taxa USD',
        description: 'Buscar taxa de câmbio do Dólar Americano',
        parameters: { currency: 'USD' }
      },
      {
        name: 'Taxa EUR',
        description: 'Buscar taxa de câmbio do Euro',
        parameters: { currency: 'EUR' }
      },
      {
        name: 'Taxa GBP',
        description: 'Buscar taxa de câmbio da Libra Esterlina',
        parameters: { currency: 'GBP' }
      },
      {
        name: 'Taxa ZAR',
        description: 'Buscar taxa de câmbio do Rand Sul-Africano',
        parameters: { currency: 'ZAR' }
      }
    ]
  },
  {
    id: 'sell-metical',
    name: 'Vender Metical (DEPRECATED)',
    method: 'GET',
    path: '/api/v1/sell-metical',
    description: 'DEPRECATED: Use /quote com from=MZN&to=CURRENCY',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        required: true,
        description: 'Valor em Metical a ser vendido (mínimo 0.01)',
        example: 1000
      },
      {
        name: 'currency',
        type: 'string',
        required: true,
        description: 'Moeda de destino',
        example: 'USD'
      }
    ],
    testCases: [
      {
        name: 'Vender MZN por USD',
        description: 'Vender 1000 MZN por Dólares',
        parameters: { amount: 1000, currency: 'USD' }
      },
      {
        name: 'Vender MZN por EUR',
        description: 'Vender 500 MZN por Euros',
        parameters: { amount: 500, currency: 'EUR' }
      }
    ]
  },
  {
    id: 'sell-foreign-currency',
    name: 'Vender Moeda Estrangeira (DEPRECATED)',
    method: 'GET',
    path: '/api/v1/sell-foreign-currency',
    description: 'DEPRECATED: Use /quote com from=CURRENCY&to=MZN',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        required: true,
        description: 'Valor da moeda estrangeira a ser vendida (mínimo 0.01)',
        example: 100
      },
      {
        name: 'currency',
        type: 'string',
        required: true,
        description: 'Código da moeda estrangeira',
        example: 'USD'
      }
    ],
    testCases: [
      {
        name: 'Vender USD por MZN',
        description: 'Vender 100 USD por Metical',
        parameters: { amount: 100, currency: 'USD' }
      },
      {
        name: 'Vender EUR por MZN',
        description: 'Vender 50 EUR por Metical',
        parameters: { amount: 50, currency: 'EUR' }
      }
    ]
  },
  {
    id: 'buy-foreign-currency',
    name: 'Comprar Moeda Estrangeira (DEPRECATED)',
    method: 'GET',
    path: '/api/v1/buy-foreign-currency',
    description: 'DEPRECATED: Use /quote com from=MZN&to=CURRENCY',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        required: true,
        description: 'Valor em Metical para comprar moeda estrangeira (mínimo 0.01)',
        example: 1000
      },
      {
        name: 'currency',
        type: 'string',
        required: true,
        description: 'Código da moeda estrangeira a comprar',
        example: 'USD'
      }
    ],
    testCases: [
      {
        name: 'Comprar USD com MZN',
        description: 'Comprar USD com 1000 MZN',
        parameters: { amount: 1000, currency: 'USD' }
      },
      {
        name: 'Comprar EUR com MZN',
        description: 'Comprar EUR com 500 MZN',
        parameters: { amount: 500, currency: 'EUR' }
      }
    ]
  }
];