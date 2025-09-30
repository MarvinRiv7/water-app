import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { Button } from "@/components/ui/button";
import { ClientForm, type ClientFormData } from "../components/ClientForm";

export default function AddClientPage() {
  const navigate = useNavigate();

  const handleAdd = async (data: ClientFormData) => {
    try {
      const res = await api.post("/clients", data);
      toast.success(`✅ Cliente ${res.data.client.nombre} agregado con éxito`);
      navigate("/clients");
    } catch (err: any) {
      let msg = "❌ Error al agregar cliente";
      if (err.response?.data?.msg) {
        msg = err.response.data.msg;
      }
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
          Agregar Cliente
        </h1>
        <div />
      </header>

      {/* Contenido */}
      <main className="flex-1 flex justify-center items-start p-6 sm:p-8">
        <div className="w-full max-w-2xl px-2 sm:px-0">
          <ClientForm onSubmit={handleAdd} />
        </div>
      </main>
    </div>
  );
}
