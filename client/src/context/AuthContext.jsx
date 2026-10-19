import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lexiai_token') || null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    serverKeyConfigured: false,
    modelName: 'gemini-1.5-flash',
  });

  // Check system configuration status (e.g. if server has GEMINI_API_KEY)
  const fetchSystemStatus = async () => {
    try {
      const res = await api.get('/auth/system-status');
      if (res.data?.success) {
        setSystemStatus(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch system status', err);
    }
  };

  // Fetch current user if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      fetchSystemStatus();
      const storedToken = localStorage.getItem('lexiai_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      const { user: userData, token: jwtToken } = res.data.data;
      localStorage.setItem('lexiai_token', jwtToken);
      localStorage.setItem('lexiai_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.success) {
      const { user: userData, token: jwtToken } = res.data.data;
      localStorage.setItem('lexiai_token', jwtToken);
      localStorage.setItem('lexiai_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('lexiai_token');
    localStorage.removeItem('lexiai_user');
    setToken(null);
    setUser(null);
  };

  const updateApiKey = async (apiKey) => {
    const res = await api.put('/auth/api-key', { apiKey });
    if (res.data?.success) {
      setUser((prev) => ({
        ...prev,
        hasCustomApiKey: Boolean(apiKey && apiKey.trim().length > 0),
      }));
      return res.data;
    }
    throw new Error(res.data?.message || 'Failed to update API key');
  };

  const updateProfile = async (updates) => {
    const res = await api.put('/auth/profile', updates);
    if (res.data?.success) {
      setUser((prev) => ({
        ...prev,
        ...res.data.data,
      }));
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to update profile');
  };

  // True if user either has custom key OR server has key configured
  const hasValidAiKey = Boolean(user?.hasCustomApiKey || systemStatus.serverKeyConfigured);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        systemStatus,
        hasValidAiKey,
        login,
        register,
        logout,
        updateApiKey,
        updateProfile,
        fetchSystemStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
