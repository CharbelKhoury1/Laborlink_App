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

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state only once
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        
        const userData = await AsyncStorage.getItem('user');
        if (userData && isMounted) {
          const parsedUser = JSON.parse(userData);
          console.log('✅ User loaded from storage:', parsedUser.email, parsedUser.userType);
          setUser(parsedUser);
        } else if (isMounted) {
          console.log('ℹ️ No user found in storage');
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
        if (isMounted) {
          setError('Failed to load user data');
        }
      } finally {
        if (isMounted) {
          setInitialized(true);
          console.log('✅ Auth initialization completed');
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Attempting login for:', email);
      
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
      
      // Simulate logout delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await AsyncStorage.removeItem('user');
      setUser(null);
      setError(null);
      console.log('✅ User logged out successfully');
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