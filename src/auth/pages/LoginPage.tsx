import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { loginSuccess } from "../features/authSlice";
import api from "../../services/api";
import { LoginForm, type LoginFormData } from "./LoginForm";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const res = await api.post("/auth", data);
      dispatch(loginSuccess(res.data.token));
      toast.success("¡Inicio de sesión exitoso!");
      navigate("/");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Error en login";
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Toaster />
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-gradient-to-r from-gray-500 to-gray-600 rounded-full p-4 shadow-md w-fit mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2C8.13 7 6 10.13 6 13a6 6 0 0012 0c0-2.87-2.13-6-6-11z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Sistema Agua Potable Adesco
          </CardTitle>
          <CardDescription className="text-gray-500">
            Cton Ojos de Agua · Acceso de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={handleLogin} />
        </CardContent>
      </Card>
    </div>
  );
}
