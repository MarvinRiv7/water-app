import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { loginSuccess } from "../features/authSlice";
import api from "../../services/api";
import { LoginForm, type LoginFormData } from "../components/LoginForm";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const res = await api.post("/auth", data);
      dispatch(loginSuccess(res.data.token));
      toast.success("¡Inicio de sesión exitoso!");
      navigate("/");
    } catch (err: unknown) {
      let message = "Error en login";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        // @ts-expect-error: dynamic error shape from API
        message = err.response.data.error || message;
      }
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          {/* Imagen del logo */}
          <div className="mx-auto rounded-full p-4 shadow-md w-fit mb-3">
            <img
              src="/logo.jpg"
              alt="Logo Adesco"
              className="w-16 h-16 object-contain"
            />
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
