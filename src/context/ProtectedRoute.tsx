import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';


const ProtectedRoute: React.FC = () => {
  const auth = useContext(AuthContext);
  // If context is undefined or user is not logged in, redirect to login
  if (!auth || !auth.email) {
    return <Navigate to="/auth/login" replace />;
  }
  // If logged in, render the child routes
  return <Outlet />;
}

export default ProtectedRoute