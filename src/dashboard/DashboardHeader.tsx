import { logout } from "@/auth/features/authSlice";
import { Button } from "@/components/ui/button";
import { Droplet, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";


export default function DashboardHeader() {
  const dispatch = useDispatch();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <h1 className="text-3xl font-extrabold text-blue-800 flex items-center gap-2">
        <Droplet className="w-7 h-7 text-blue-600" />
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
