import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const adminToken = localStorage.getItem("adminToken");
    setIsAuthenticated(!!adminToken);
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    // For demo purposes, using hardcoded credentials
    // In a real app, this would be an API call
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("adminToken", "demo-token");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
