import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await api.post('/users/login', { username, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await api.post('/users', { username, email, password });
    return response.data;
  };

  const logout = async () => {
    try {
      // Try to logout on the server
      await api.post('/users/logout');
      console.log('✅ Server logout successful');
    } catch (error) {
      console.error('❌ Server logout error:', error);
      // Continue with client-side logout even if server logout fails
      // This ensures the user can always logout from the frontend
    }
    
    // Always clean up client-side state
    localStorage.removeItem('token');
    setUser(null);
    
    // Redirect to login page
    window.location.href = '/login';
  };

  return { user, loading, login, register, logout };
};