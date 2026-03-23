import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PublicOnly: React.FC = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (auth !== null) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicOnly;
