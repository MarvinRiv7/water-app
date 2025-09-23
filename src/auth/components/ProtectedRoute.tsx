import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";
import type { RootState } from "../../store/store";
import { logout } from "../features/authSlice";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      try {
        const { exp }: { exp: number } = jwtDecode(token);
        if (exp * 1000 < Date.now()) {
          dispatch(logout()); // ✅ token vencido → logout inmediato
        }
      } catch {
        dispatch(logout()); // token inválido
      }
    }
  }, [token, dispatch]);

  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
