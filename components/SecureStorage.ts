import AsyncStorage from '@react-native-async-storage/async-storage';

interface StoredCredentials {
  email: string;
  hashedPassword: string;
  salt: string;
  userType: 'worker' | 'client';
  createdAt: string;
}

class SecureStorage {
  private static readonly USERS_KEY = 'workconnect_users';
  private static readonly CURRENT_USER_KEY = 'workconnect_current_user';

  // Simple hash function for demo purposes
  // In production, use a proper cryptographic library
  private static async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    
    // For web compatibility, we'll use a simple hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private static generateSalt(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  static async registerUser(
    username: string, 
    email: string, 
    password: string, 
    userType: 'worker' | 'client'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user already exists
      const existingUsers = await this.getAllUsers();
      const userExists = existingUsers.some(
        user => user.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const salt = this.generateSalt();
      const hashedPassword = await this.hashPassword(password, salt);
      
      const newUser: StoredCredentials = {
        email: email.toLowerCase(),
        hashedPassword,
        salt,
        userType,
        createdAt: new Date().toISOString()
      };

      // Store user
      const updatedUsers = [...existingUsers, newUser];
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(updatedUsers));

      // Set as current user
      await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify({
        id: Date.now().toString(),
        name: username,
        email: email.toLowerCase(),
        userType,
        verified: false,
        createdAt: new Date(),
        language: 'en'
      }));

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  static async loginUser(
    email: string, 
    password: string
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const hashedPassword = await this.hashPassword(password, user.salt);
      
      if (hashedPassword !== user.hashedPassword) {
        return { success: false, error: 'Invalid password' };
      }

      // Set as current user
      const currentUser = {
        id: Date.now().toString(),
        name: user.email.split('@')[0], // Use email prefix as name
        email: user.email,
        userType: user.userType,
        verified: true,
        createdAt: new Date(user.createdAt),
        language: 'en'
      };

      await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser));

      return { success: true, user: currentUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  static async getCurrentUser(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(this.CURRENT_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.USERS_KEY, this.CURRENT_USER_KEY]);
    } catch (error) {
      console.error('Clear data error:', error);
    }
  }

  private static async getAllUsers(): Promise<StoredCredentials[]> {
    try {
      const usersData = await AsyncStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  }

  // Check if username is available
  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      return !users.some(user => 
        user.email.split('@')[0].toLowerCase() === username.toLowerCase()
      );
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  }

  // Check if email is available
  static async isEmailAvailable(email: string): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      return !users.some(user => 
        user.email.toLowerCase() === email.toLowerCase()
      );
    } catch (error) {
      console.error('Email check error:', error);
      return false;
    }
  }
}

export default SecureStorage;