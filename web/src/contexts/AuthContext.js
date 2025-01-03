import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(decodedToken);
        }
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await api.post('/user/login', userData);
      if (response.data.isSuccess) {
        localStorage.setItem('token', response.data.data.token);
        setUser(jwtDecode(response.data.data.token));
        return response.data;
      } else {
        throw new Error(response.data.error.errorMessage);
      }
    } catch (error) {
      throw new Error('Giriş başarısız oldu');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 