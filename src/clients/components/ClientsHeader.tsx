import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientsHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center justify-between mb-6 gap-4 w-full">
      {/* Contenedor del botón + título */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black drop-shadow-sm truncate">
        Gestión de Clientes
        </h1>
      </div>

      {/* Si necesitas otro elemento a la derecha, se puede poner aquí */}
      <div className="flex-1 sm:flex-none" />
    </div>
  );
}
