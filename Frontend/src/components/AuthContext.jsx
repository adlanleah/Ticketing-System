import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Fetch current user info if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setAuthLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get('/api/auth/me'); 
        setCurrentUser(response.data.data.user);
      } catch (err) {
        setCurrentUser(null);
        localStorage.removeItem('token');
      } finally {
        setAuthLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Login function
  const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  console.log('Login Response:', response.data);
  const token = response.data.token;
  const user = response.data.data.user; 
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  setCurrentUser (user); 
};

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // Register function
  const register = async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    setCurrentUser(response.data.data.user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
