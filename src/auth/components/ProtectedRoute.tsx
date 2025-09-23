import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";


const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
