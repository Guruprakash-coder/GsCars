import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if the "key" exists in the browser's memory
  const isAuthenticated = localStorage.getItem("isAdmin") === "true";

  // If yes, render the children (Admin Page). If no, redirect to Login.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;