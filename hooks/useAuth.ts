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

  useEffect(() => {
    loadUser();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading user from storage...'); // Debug log
      
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('✅ User loaded successfully:', parsedUser.email, parsedUser.userType); // Debug log
        setUser(parsedUser);
      } else {
        console.log('ℹ️ No user found in storage'); // Debug log
      }
    } catch (error) {
      console.error('❌ Error loading user:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
      setInitialized(true);
      console.log('✅ Auth initialization completed'); // Debug log
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Attempting login for:', email); // Debug log
      
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      
      console.log('✅ Login successful, saving user:', mockUser.email, mockUser.userType); // Debug log
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
      console.log('🔄 Attempting registration for:', userData.email); // Debug log
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      
      console.log('✅ Registration successful, saving user:', newUser.email, newUser.userType); // Debug log
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
      console.log('🔄 Logging out user...'); // Debug log
      
      // Simulate logout delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await AsyncStorage.removeItem('user');
      setUser(null);
      setError(null);
      console.log('✅ User logged out successfully'); // Debug log
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