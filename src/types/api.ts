export interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: ApiParameter[];
  testCases: TestCase[];
}

export interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description: string;
  example?: any;
}

export interface TestCase {
  name: string;
  description: string;
  parameters: Record<string, any>;
  expectedResult?: string;
}

export interface ApiTestResult {
  success: boolean;
  status: number;
  data?: any;
  error?: string;
  timestamp: string;
  duration: number;
}