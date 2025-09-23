import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientsHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
        <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow-sm">
          👥 Gestión de Clientes
        </h1>
      </div>
    </div>
  );
}
