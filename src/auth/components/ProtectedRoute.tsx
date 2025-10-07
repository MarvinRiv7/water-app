import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import type { RootState } from "../../store/store";
import { logout } from "../features/authSlice";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      try {
        const { exp }: { exp: number } = jwtDecode(token);

        //tiempo que falta para expirar en ms
        const timeLeft = exp * 1000 - Date.now();

        if (timeLeft <= 0) {
          dispatch(logout()); // ya vencido → logout inmediato
        } else {
          //programar logout automático cuando llegue la expiración
          const timer = setTimeout(() => {
            dispatch(logout());
          }, timeLeft);

          return () => clearTimeout(timer);
        }
      } catch {
        dispatch(logout()); // token inválido → cerrar sesión
      }
    }
  }, [token, dispatch]);

  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
