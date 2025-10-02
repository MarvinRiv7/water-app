import { logout } from "@/auth/features/authSlice";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

export default function DashboardHeader() {
  const dispatch = useDispatch();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <h1 className="text-3xl font-extrabold text-blue-800 flex items-center gap-2">
        {/* Imagen del logo */}
        <img
          src="/logo.jpg"   // <--- Asegúrate que el archivo se llame logo.png en /public
          alt="Logo Adesco"
          className="w-10 h-10 object-contain"
        />
        Adesco Cton Ojos de Agua
      </h1>
      <Button
        onClick={() => dispatch(logout())}
        variant="destructive"
        className="flex items-center gap-2"
      >
        <LogOut size={18} />
        Cerrar sesión
      </Button>
    </header>
  );
}
