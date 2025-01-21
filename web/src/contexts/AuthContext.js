import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../store/userSlice';
import { getMe } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const login = (userData) => {
    dispatch(setUser(userData));
  };

  const logout = () => {
    dispatch(clearUser());
    localStorage.removeItem('token');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      try {
        const response = await getMe();
        if (response.isSuccess) {
          dispatch(setUser(response.data));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 