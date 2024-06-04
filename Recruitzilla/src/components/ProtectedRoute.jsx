import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or any loading spinner/UI
  }

  return allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/app/filter" />
  );
};

export default ProtectedRoute;
