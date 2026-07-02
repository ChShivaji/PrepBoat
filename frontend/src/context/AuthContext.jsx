import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists and is valid on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh user profile details in background
          const res = await api.get('/api/auth/me');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Session verification failed: ", err);
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { access_token, user: loggedUser } = res.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Invalid login credentials. Please try again.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, college, branch, cgpa, targetRole) => {
    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
        college,
        branch,
        cgpa: cgpa ? parseFloat(cgpa) : null,
        target_role: targetRole,
        role: "student"
      });
      
      // Auto login after successful registration
      return await login(email, password);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Registration failed. Email might already be taken.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/api/auth/me', profileData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Profile update failed.";
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Request failed.";
      return { success: false, error: errorMsg };
    }
  };

  const googleLogin = async (email, name) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/google-login', { email, name });
      const { access_token, user: loggedUser } = res.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Google authentication failed.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, forgotPassword, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
