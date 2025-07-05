import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, WorkerProfile, ClientProfile } from '@/types';

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 🚨 DEVELOPMENT MODE: Authentication disabled for testing
// TODO: Remove this flag and restore authentication before production
const DEV_MODE_SKIP_AUTH = true;

// Mock user for development - change userType as needed for testing
const DEV_MOCK_USER: User = {
  id: 'dev-user-123',
  name: 'Development User',
  email: 'dev@workconnect.com',
  phone: '+961 70 123 456',
  userType: 'worker', // Change to 'client' to test client features
  verified: true,
  createdAt: new Date(),
  language: 'en'
};

// Singleton to prevent multiple initializations
let authInitialized = false;
let authPromise: Promise<User | null> | null = null;

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state only once using singleton pattern
  useEffect(() => {
    if (authInitialized) {
      // If already initialized, just set the current state
      if (DEV_MODE_SKIP_AUTH) {
        setUser(DEV_MOCK_USER);
        setInitialized(true);
      }
      return;
    }

    // Mark as initializing to prevent multiple calls
    authInitialized = true;

    const initializeAuth = async (): Promise<User | null> => {
      try {
        console.log('🔄 Initializing authentication...');
        
        // 🚨 DEV MODE: Skip authentication and use mock user
        if (DEV_MODE_SKIP_AUTH) {
          console.log('⚠️ DEVELOPMENT MODE: Authentication bypassed');
          console.log('✅ Using mock user:', DEV_MOCK_USER.email, DEV_MOCK_USER.userType);
          return DEV_MOCK_USER;
        }

        // 🔒 PRODUCTION CODE: Normal authentication flow (currently disabled)
        /*
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('✅ User loaded from storage:', parsedUser.email, parsedUser.userType);
          return parsedUser;
        } else {
          console.log('ℹ️ No user found in storage');
          return null;
        }
        */
        return null;
      } catch (error) {
        console.error('❌ Error loading user:', error);
        throw new Error('Failed to load user data');
      }
    };

    // Create or reuse the auth promise
    if (!authPromise) {
      authPromise = initializeAuth();
    }

    authPromise
      .then((userData) => {
        setUser(userData);
        setInitialized(true);
        console.log('✅ Auth initialization completed');
      })
      .catch((error) => {
        setError(error.message);
        setInitialized(true);
      });
  }, []); // Empty dependency array - only run once

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
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
        setUser(mockUser);
        return true;
      }

      // 🔒 PRODUCTION CODE: Normal login flow (currently disabled)
      /*
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
      setUser(mockUser);
      return true;
      */
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
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
        setUser(newUser);
        return true;
      }

      // 🔒 PRODUCTION CODE: Normal registration flow (currently disabled)
      /*
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
      setUser(newUser);
      return true;
      */
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔄 Logging out user...');
      
      // 🚨 DEV MODE: Quick logout without storage operations
      if (DEV_MODE_SKIP_AUTH) {
        console.log('⚠️ DEVELOPMENT MODE: Logout bypassed');
        await new Promise(resolve => setTimeout(resolve, 200));
        setUser(null);
        setError(null);
        // Reset auth state for next login
        authInitialized = false;
        authPromise = null;
        console.log('✅ Mock logout successful');
        return;
      }

      // 🔒 PRODUCTION CODE: Normal logout flow (currently disabled)
      /*
      // Simulate logout delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await AsyncStorage.removeItem('user');
      setUser(null);
      setError(null);
      console.log('✅ User logged out successfully');
      */
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    login,
    register,
    logout,
    loading,
    initialized,
    error,
    clearError
  };
};