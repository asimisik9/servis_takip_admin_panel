import { useState } from 'react';
import { isAuthenticated as hasSession, logout } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasSession());

  const signOut = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, signOut };
};
