import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router";

const Authentificated: React.FC = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (auth === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default Authentificated;
