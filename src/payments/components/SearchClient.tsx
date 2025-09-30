import { Search, Loader2 } from "lucide-react";
import type { Client } from "@/types";

type Props = {
  clientDui: string;
  setClientDui: (dui: string) => void;
  client: Client | null;
  loading: boolean;
  fetchMeses: () => void;
};

export default function SearchClient({
  clientDui,
  setClientDui,
  client,
  loading,
  fetchMeses,
}: Props) {
  // Función que agrega el guion en la posición 9
  const formatDui = (value: string) => {
    // Solo números
    let digits = value.replace(/\D/g, "");

    // Máximo 9 dígitos (8 + 1)
    if (digits.length > 9) digits = digits.slice(0, 9);

    // Insertar guion después de 8 dígitos
    if (digits.length > 8) {
      return digits.slice(0, 8) + "-" + digits.slice(8);
    }
    return digits;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDui(e.target.value);
    setClientDui(formatted);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 mb-8 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <span className="ml-2 text-blue-600 font-medium">Buscando...</span>
        </div>
      )}

      <h3 className="flex gap-2 items-center text-gray-700 text-lg font-semibold mb-4">
        <Search size={18} /> Buscar Cliente
      </h3>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ingrese DUI del cliente"
          value={clientDui}
          onChange={handleChange}
          disabled={loading}
          className="flex-1 border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 outline-none disabled:bg-gray-100"
        />
        <button
          onClick={fetchMeses}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
        >
          {!loading ? "Buscar" : <Loader2 size={18} className="animate-spin" />}
        </button>
      </div>

      {client &&
        (client.estado === "Exonerado" || client.estado === "Desconectado") && (
          <p className="mt-3 text-sm text-red-600 font-medium">
            El cliente está {client.estado}. No se puede consultar meses.
          </p>
        )}
    </div>
  );
}
