import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {

    const user = useSelector((state) => state.auth.userData);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
   
   if (!user && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
  
}

export default ProtectedRoute
