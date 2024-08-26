// WinnerProvider.tsx
import React, { createContext, useContext } from 'react';
import Toast from 'react-native-toast-message';

interface WinnerProviderProps {
  showNotification: (message: string) => void;
}

const WinnerContext = createContext<WinnerProviderProps | undefined>(undefined);

export const WinnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showNotification = (message: string) => {
    Toast.show({
      type: 'success', // Customize the type (success, error, info, etc.)
      text1: message, // Ensure `message` is a string
      position: 'top', // Optional: Set the position (top, bottom)
      visibilityTime: 10000, // Optional: Duration the toast should be visible
    });
  };

  return (
    <WinnerContext.Provider value={{ showNotification }}>
      {children}
      <Toast /> 
    </WinnerContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(WinnerContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
