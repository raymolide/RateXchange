import React, { useState } from 'react';
import { Play, Clock, CheckCircle, XCircle, Code, Copy, Download, AlertTriangle } from 'lucide-react';
import { apiEndpoints } from '../data/apiEndpoints';
import { apiTester } from '../services/apiTester';
import { ApiTestResult, TestCase } from '../types/api';
import { useApp } from '../contexts/AppContext';

export const ApiTester: React.FC = () => {
  const { t, isDark } = useApp();
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0]);
  const [testResults, setTestResults] = useState<Record<string, ApiTestResult>>({});
  const [isRunning, setIsRunning] = useState<Record<string, boolean>>({});
  const [customParameters, setCustomParameters] = useState<Record<string, any>>({});

  const runTest = async (testCase: TestCase, endpointId: string) => {
    const testKey = `${endpointId}-${testCase.name}`;
    setIsRunning(prev => ({ ...prev, [testKey]: true }));

    try {
      // Replace path parameters
      let path = selectedEndpoint.path;
      Object.entries(testCase.parameters).forEach(([key, value]) => {
        path = path.replace(`{${key}}`, value.toString());
      });

      // Remove path parameters from query parameters
      const queryParams = { ...testCase.parameters };
      selectedEndpoint.parameters?.forEach(param => {
        if (selectedEndpoint.path.includes(`{${param.name}}`)) {
          delete queryParams[param.name];
        }
      });

      const result = await apiTester.testEndpoint(
        selectedEndpoint.method,
        path,
        queryParams
      );

      setTestResults(prev => ({ ...prev, [testKey]: result }));
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunning(prev => ({ ...prev, [testKey]: false }));
    }
  };

  const runAllTests = async () => {
    for (const testCase of selectedEndpoint.testCases) {
      await runTest(testCase, selectedEndpoint.id);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const runCustomTest = async () => {
    const testKey = `${selectedEndpoint.id}-custom`;
    setIsRunning(prev => ({ ...prev, [testKey]: true }));

    try {
      let path = selectedEndpoint.path;
      Object.entries(customParameters).forEach(([key, value]) => {
        path = path.replace(`{${key}}`, value.toString());
      });

      const queryParams = { ...customParameters };
      selectedEndpoint.parameters?.forEach(param => {
        if (selectedEndpoint.path.includes(`{${param.name}}`)) {
          delete queryParams[param.name];
        }
      });

      const result = await apiTester.testEndpoint(
        selectedEndpoint.method,
        path,
        queryParams
      );

      setTestResults(prev => ({ ...prev, [testKey]: result }));
    } catch (error) {
      console.error('Custom test failed:', error);
    } finally {
      setIsRunning(prev => ({ ...prev, [testKey]: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResults = () => {
    const results = JSON.stringify(testResults, null, 2);
    const blob = new Blob([results], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const getStatusColor = (status: number, success: boolean) => {
    if (!success) return 'text-red-500';
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 300 && status < 400) return 'text-yellow-500';
    return 'text-red-500';
  };

  const isDeprecatedEndpoint = (endpointId: string) => {
    return ['sell-metical', 'sell-foreign-currency', 'buy-foreign-currency'].includes(endpointId);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Testador da API Metical Converter
            </h2>
            <p className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Teste todos os endpoints da API de conversão de moedas
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={runAllTests}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Executar Todos</span>
            </button>
            
            <button
              onClick={downloadResults}
              className={`p-2 rounded-xl transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Endpoint Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {apiEndpoints.map((endpoint) => (
            <button
              key={endpoint.id}
              onClick={() => setSelectedEndpoint(endpoint)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative ${
                selectedEndpoint.id === endpoint.id
                  ? isDark
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-green-600 bg-green-50 text-green-700'
                  : isDark
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
              }`}
            >
              {isDeprecatedEndpoint(endpoint.id) && (
                <div className="absolute top-2 right-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500"   />
                </div>
              )}
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  endpoint.method === 'GET' 
                    ? 'bg-blue-100 text-blue-800' 
                    : endpoint.method === 'POST'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {endpoint.method}
                </span>
                <span className="font-medium">{endpoint.name}</span>
              </div>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {endpoint.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Cases */}
        <div className={`rounded-2xl p-6 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Casos de Teste
          </h3>

          {/* Endpoint Info */}
          <div className={`p-4 rounded-xl mb-6 ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                selectedEndpoint.method === 'GET' 
                  ? 'bg-blue-100 text-blue-800' 
                  : selectedEndpoint.method === 'POST'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedEndpoint.method}
              </span>
              <code className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {selectedEndpoint.path}
              </code>
              {isDeprecatedEndpoint(selectedEndpoint.id) && (
                <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800">
                  DEPRECATED
                </span>
              )}
            </div>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {selectedEndpoint.description}
            </p>
          </div>

          {/* Parameters */}
          {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
            <div className="mb-6">
              <h4 className={`text-lg font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Parâmetros
              </h4>
              <div className="space-y-3">
                {selectedEndpoint.parameters.map((param) => (
                  <div key={param.name} className={`p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {param.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        param.required 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {param.required ? 'Obrigatório' : 'Opcional'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {param.type}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {param.description}
                    </p>
                    {param.example && (
                      <code className={`text-xs ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                        Exemplo: {param.example}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Test */}
          <div className="mb-6">
            <h4 className={`text-lg font-semibold mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Teste Personalizado
            </h4>
            <div className="space-y-3">
              {selectedEndpoint.parameters?.map((param) => (
                <div key={param.name}>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {param.name} {param.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={param.type === 'number' ? 'number' : 'text'}
                    value={customParameters[param.name] || ''}
                    onChange={(e) => setCustomParameters(prev => ({
                      ...prev,
                      [param.name]: param.type === 'number' ? parseFloat(e.target.value) : e.target.value
                    }))}
                    placeholder={param.example?.toString() || `Digite ${param.name}`}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                </div>
              ))}
              <button
                onClick={runCustomTest}
                disabled={isRunning[`${selectedEndpoint.id}-custom`]}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isRunning[`${selectedEndpoint.id}-custom`] ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Executando...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Executar Teste</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Predefined Test Cases */}
          <div className="space-y-3">
            <h4 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Casos de Teste Predefinidos
            </h4>
            {selectedEndpoint.testCases.map((testCase) => {
              const testKey = `${selectedEndpoint.id}-${testCase.name}`;
              const result = testResults[testKey];
              const running = isRunning[testKey];

              return (
                <div key={testCase.name} className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {testCase.name}
                    </h5>
                    <button
                      onClick={() => runTest(testCase, selectedEndpoint.id)}
                      disabled={running}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      {running ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>Executando</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Executar</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <p className={`text-sm mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {testCase.description}
                  </p>
                  
                  <div className={`text-xs p-2 rounded ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <strong>Parâmetros:</strong> {formatJson(testCase.parameters)}
                  </div>

                  {result && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={getStatusColor(result.status, result.success)}>
                          Status: {result.status}
                        </span>
                        <span className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          ({result.duration}ms)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Results with Scroll */}
        <div className={`rounded-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Resultados dos Testes
            </h3>
          </div>

          {/* Scrollable Results Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {Object.entries(testResults)
              .filter(([key]) => key.startsWith(selectedEndpoint.id))
              .map(([key, result]) => {
                const testName = key.split('-').slice(1).join('-');
                
                return (
                  <div key={key} className={`p-4 rounded-lg border ${
                    result.success 
                      ? isDark ? 'border-green-800 bg-green-900/20' : 'border-green-200 bg-green-50'
                      : isDark ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {testName}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={getStatusColor(result.status, result.success)}>
                          {result.status}
                        </span>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{result.duration}ms</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(formatJson(result))}
                          className={`p-1 rounded transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {result.error && (
                      <div className="mb-3">
                        <span className="text-red-500 font-medium">Erro:</span>
                        <p className="text-red-600 text-sm mt-1">{result.error}</p>
                      </div>
                    )}

                    {result.data && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Code className="w-4 h-4" />
                          <span className={`font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            Dados da Resposta
                          </span>
                        </div>
                        <pre className={`text-xs p-3 rounded overflow-x-auto ${
                          isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {formatJson(result.data)}
                        </pre>
                      </div>
                    )}

                    <div className={`text-xs mt-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Testado em: {new Date(result.timestamp).toLocaleString('pt-PT')}
                    </div>
                  </div>
                );
              })}

            {Object.keys(testResults).filter(key => key.startsWith(selectedEndpoint.id)).length === 0 && (
              <div className="text-center py-8">
                <Code className={`w-12 h-12 mx-auto mb-3 ${
                  isDark ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`text-lg font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Nenhum resultado de teste ainda
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Execute um teste para ver os resultados aqui
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};