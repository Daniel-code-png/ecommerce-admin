import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Verificar que sea admin
        if (response.data.user.isAdmin) {
          setUser(response.data.user);
        } else {
          // Si NO es admin, solo limpiar - NO redirigir
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        // Si hay error, limpiar token
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    
    // Verificar que sea admin
    if (!response.data.user.isAdmin) {
      throw new Error('No tienes permisos de administrador');
    }
    
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};