// src/layouts/ProtectedLayout.tsx
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../auth/components/ProtectedRoute";

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
