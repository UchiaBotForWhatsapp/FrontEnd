import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (userData: Record<string, string>) => Promise<boolean>;
  logout: () => void;
}

// Mock auth for frontend MVP
export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    // Mock login - in production, call authService.login
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (identifier && password) {
      const mockUser = {
        id: '1',
        nome: 'Usuário Teste',
        email: identifier.includes('@') ? identifier : `${identifier}@email.com`,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock_token_123');
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Record<string, string>): Promise<boolean> => {
    // Mock register - in production, call authService.register
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (userData.email && userData.senha) {
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };
};

// Context for provider pattern (optional)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
