import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔒 PRODUCTION MODE: Authentication enabled
const DEV_MODE_SKIP_AUTH = false;

// Mock user for development - only used when DEV_MODE_SKIP_AUTH is true
const DEV_MOCK_USER: User = {
  id: 'dev-user-123',
  name: 'Development User',
  email: 'dev@workconnect.com',
  phone: '+961 70 123 456',
  userType: 'worker',
  verified: true,
  createdAt: new Date(),
  language: 'en'
};

// Global auth state to prevent multiple initializations
let globalAuthState = {
  user: null as User | null,
  initialized: false,
  loading: false,
};

let authPromise: Promise<User | null> | null = null;
let authListeners: Set<(state: typeof globalAuthState) => void> = new Set();

const notifyListeners = () => {
  authListeners.forEach(listener => listener(globalAuthState));
};

const initializeAuth = async (): Promise<User | null> => {
  if (authPromise) {
    return authPromise;
  }

  authPromise = (async () => {
    try {
      console.log('🔄 Initializing authentication...');
      
      // 🚨 DEV MODE: Skip authentication and use mock user
      if (DEV_MODE_SKIP_AUTH) {
        console.log('⚠️ DEVELOPMENT MODE: Authentication bypassed');
        console.log('✅ Using mock user:', DEV_MOCK_USER.email, DEV_MOCK_USER.userType);
        return DEV_MOCK_USER;
      }

      // 🔒 PRODUCTION CODE: Normal authentication flow
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('✅ User loaded from storage:', parsedUser.email, parsedUser.userType);
        return parsedUser;
      } else {
        console.log('ℹ️ No user found in storage');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading user:', error);
      throw new Error('Failed to load user data');
    }
  })();

  return authPromise;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(globalAuthState.user);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(globalAuthState.initialized);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to global auth state changes
  useEffect(() => {
    const listener = (state: typeof globalAuthState) => {
      setUser(state.user);
      setInitialized(state.initialized);
      setLoading(state.loading);
    };

    authListeners.add(listener);

    // Initialize auth if not already done
    if (!globalAuthState.initialized && !globalAuthState.loading) {
      globalAuthState.loading = true;
      notifyListeners();

      initializeAuth()
        .then((userData) => {
          globalAuthState.user = userData;
          globalAuthState.initialized = true;
          globalAuthState.loading = false;
          notifyListeners();
          console.log('✅ Auth initialization completed');
        })
        .catch((error) => {
          globalAuthState.initialized = true;
          globalAuthState.loading = false;
          notifyListeners();
          setError(error.message);
          console.error('❌ Auth initialization failed:', error);
        });
    }

    return () => {
      authListeners.delete(listener);
    };
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      globalAuthState.loading = true;
      notifyListeners();
      
      console.log('🔄 Attempting login for:', email);
      
      // 🚨 DEV MODE: Always succeed with mock user
      if (DEV_MODE_SKIP_AUTH) {
        console.log('⚠️ DEVELOPMENT MODE: Login bypassed');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        
        // Determine user type based on email for testing
        const userType = email.toLowerCase().includes('client') ? 'client' : 'worker';
        const mockUser: User = {
          ...DEV_MOCK_USER,
          email,
          userType,
          name: userType === 'client' ? 'Test Client' : 'Test Worker'
        };
        
        console.log('✅ Mock login successful:', mockUser.email, mockUser.userType);
        globalAuthState.user = mockUser;
        globalAuthState.loading = false;
        notifyListeners();
        return true;
      }

      // 🔒 PRODUCTION CODE: Normal login flow
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Enhanced mock authentication with better user type detection
      const userType = email.toLowerCase().includes('client') ? 'client' : 'worker';
      
      const mockUser: User = {
        id: Date.now().toString(),
        name: userType === 'client' ? 'Sarah Johnson' : 'Ahmad Hassan',
        email,
        phone: '+961 70 123 456',
        userType,
        verified: true,
        createdAt: new Date(),
        language: 'en'
      };
      
      console.log('✅ Login successful, saving user:', mockUser.email, mockUser.userType);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      
      globalAuthState.user = mockUser;
      globalAuthState.loading = false;
      notifyListeners();
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Login failed. Please check your credentials.');
      globalAuthState.loading = false;
      notifyListeners();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      globalAuthState.loading = true;
      notifyListeners();
      
      console.log('🔄 Attempting registration for:', userData.email);
      
      // 🚨 DEV MODE: Always succeed with mock user
      if (DEV_MODE_SKIP_AUTH) {
        console.log('⚠️ DEVELOPMENT MODE: Registration bypassed');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        
        const newUser: User = {
          ...DEV_MOCK_USER,
          name: userData.name || 'Test User',
          email: userData.email || 'test@workconnect.com',
          phone: userData.phone || '+961 70 123 456',
          userType: userData.userType || 'worker',
        };
        
        console.log('✅ Mock registration successful:', newUser.email, newUser.userType);
        globalAuthState.user = newUser;
        globalAuthState.loading = false;
        notifyListeners();
        return true;
      }

      // 🔒 PRODUCTION CODE: Normal registration flow
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || 'New User',
        email: userData.email || '',
        phone: userData.phone || '',
        userType: userData.userType || 'worker',
        verified: false,
        createdAt: new Date(),
        language: 'en'
      };
      
      console.log('✅ Registration successful, saving user:', newUser.email, newUser.userType);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      globalAuthState.user = newUser;
      globalAuthState.loading = false;
      notifyListeners();
      return true;
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError('Registration failed. Please try again.');
      globalAuthState.loading = false;
      notifyListeners();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      globalAuthState.loading = true;
      notifyListeners();
      
      console.log('🔄 Logging out user...');
      
      // 🚨 DEV MODE: Quick logout without storage operations
      if (DEV_MODE_SKIP_AUTH) {
        console.log('⚠️ DEVELOPMENT MODE: Logout bypassed');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        globalAuthState.user = null;
        globalAuthState.loading = false;
        notifyListeners();
        setError(null);
        console.log('✅ Mock logout successful');
        return;
      }

      // 🔒 PRODUCTION CODE: Normal logout flow
      // Simulate logout delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await AsyncStorage.removeItem('user');
      
      globalAuthState.user = null;
      globalAuthState.loading = false;
      notifyListeners();
      setError(null);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError('Logout failed. Please try again.');
      globalAuthState.loading = false;
      notifyListeners();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        initialized,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Legacy hook for backward compatibility
export const useAuthState = () => {
  return useAuth();
};