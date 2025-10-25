import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// IMPORTANTE: Agregar esta línea
const API_URL = process.env.REACT_APP_API_URL;

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
        // CAMBIO: Usar API_URL
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Verificar que sea admin
        if (response.data.user.isAdmin) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
          setUser(null);
          window.location.href = process.env.REACT_APP_STORE_URL;
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null)
      }
    }
    
    setLoading(false);
  };

  const login = async (email, password) => {
    // CAMBIO: Usar API_URL
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