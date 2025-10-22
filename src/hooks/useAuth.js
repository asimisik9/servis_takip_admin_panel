import { useState } from 'react';
import { getToken, logout } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  const signOut = () => {
    logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, signOut };
};
