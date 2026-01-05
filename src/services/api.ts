// API Service Layer - Ready for backend integration

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Generic API handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null as T,
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Auth Services
export const authService = {
  login: async (identifier: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  register: async (userData: {
    nome: string;
    email: string;
    senha: string;
    pais: string;
    cidade: string;
    telefone: string;
    genero: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  verifyAccount: async (code: string) => {
    return apiRequest('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    return { success: true, data: null };
  },
};

// Bot Services
export const botService = {
  getBots: async () => {
    return apiRequest('/bots');
  },

  createBot: async (botData: {
    nome: string;
    tipo: 'pessoal' | 'empresarial';
    plano: string;
    descricao: string;
    nomeEmpresa?: string;
    descricaoEmpresa?: string;
    instrucoes?: string;
    produtos?: Array<{ nome: string; quantidade: number }>;
  }) => {
    return apiRequest('/bots', {
      method: 'POST',
      body: JSON.stringify(botData),
    });
  },

  updateBot: async (id: string, botData: Record<string, unknown>) => {
    return apiRequest(`/bots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(botData),
    });
  },

  toggleBotStatus: async (id: string, status: boolean) => {
    return apiRequest(`/bots/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ ativo: status }),
    });
  },

  deleteBot: async (id: string) => {
    return apiRequest(`/bots/${id}`, {
      method: 'DELETE',
    });
  },
};

// Countries API
export const countriesService = {
  getCountries: async (): Promise<Array<{ name: string; code: string; dial_code: string; flag: string }>> => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag');
      const data = await response.json();
      
      return data
        .filter((country: { idd?: { root?: string } }) => country.idd?.root)
        .map((country: { name: { common: string }; cca2: string; idd: { root: string; suffixes?: string[] }; flag: string }) => ({
          name: country.name.common,
          code: country.cca2,
          dial_code: country.idd.root + (country.idd.suffixes?.[0] || ''),
          flag: country.flag,
        }))
        .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

  getCities: async (countryCode: string): Promise<string[]> => {
    // Mock implementation - in production, use a real cities API
    const mockCities: Record<string, string[]> = {
      BR: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador', 'Fortaleza', 'Curitiba', 'Recife'],
      PT: ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Funchal'],
      US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
    };
    
    return mockCities[countryCode] || ['Cidade não disponível'];
  },
};
