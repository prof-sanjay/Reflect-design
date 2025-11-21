// fe/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole");

    if (token && userId) {
      setCurrentUser({
        id: userId,
        username,
        role: userRole,
        token,
      });
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId", userData.user.id);
    localStorage.setItem("username", userData.user.username);
    localStorage.setItem("userRole", userData.user.role);
    
    setCurrentUser({
      id: userData.user.id,
      username: userData.user.username,
      role: userData.user.role,
      token: userData.token,
    });
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};