import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // 1. Get the "user" object string from memory
  const userString = localStorage.getItem("user");
  
  // 2. Convert it back to a real Object (if it exists)
  const user = userString ? JSON.parse(userString) : null;

  // 3. Check if user exists AND if they are an admin
  if (user && user.isAdmin) {
    return children; // Allowed
  } else {
    return <Navigate to="/login" />; // Kick them out
  }
};

export default PrivateRoute;