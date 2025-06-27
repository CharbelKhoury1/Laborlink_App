import { NavigatorScreenParams } from '@react-navigation/native';

type RootStackParamList = {
  '(tabs)': NavigatorScreenParams<TabParamList>;
  '(auth)': NavigatorScreenParams<AuthParamList>;
  // Add other root routes here
};

type TabParamList = {
  'index': undefined;
  'jobs': undefined;
  'jobs/[id]': { id: string };
  'jobs/post': undefined;
  'messages': undefined;
  'messages/[id]': { id: string };
  'profile': undefined;
};

type AuthParamList = {
  'login': undefined;
  'register': undefined;
  'forgot-password': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Extend the router type
declare module 'expo-router' {
  export function useRouter(): {
    push: <T extends string>(
      route: T | 
      { pathname: string, params?: Record<string, any> } | 
      { href: string, params?: Record<string, any> }
    ) => void;
    back: () => void;
    canGoBack: () => boolean;
    // Add other router methods as needed
  };
}
