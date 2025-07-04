import React, { useMemo, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useMemo(() => {
    if (sessionStorage.getItem('email')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  // If context is undefined or user is not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }
  // If logged in, render the child routes
  return <Outlet />;
}

export default ProtectedRoute