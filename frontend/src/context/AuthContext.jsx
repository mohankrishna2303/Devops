import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    try {
      const profile = await authService.getProfile();
      setUser(profile?.user || profile);
      setIsAuthenticated(!!profile?.user);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      authService.clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    await loadUser();
    return data;
  };

  const register = async (username, email, password) => {
    await authService.register(username, email, password);
    // Optional: auto-login after register
    // await login(username, password);
  };

  const socialLogin = async (provider, code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/social/${provider}/callback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Social login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('devops_access_token', data.access);
      if (data.refresh) {
        localStorage.setItem('devops_refresh_token', data.refresh);
      }
      
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return data;
    } catch (error) {
      console.error('Social login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAuthenticated,
    login,
    register,
    socialLogin,
    logout,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { AuthContext };
