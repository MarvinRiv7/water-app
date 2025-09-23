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
  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 mb-8">
      <h3 className="flex gap-2 items-center text-gray-700 text-lg font-semibold mb-4">
        <Search size={18} /> Buscar Cliente
      </h3>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ingrese DUI del cliente"
          value={clientDui}
          onChange={(e) => setClientDui(e.target.value)}
          disabled={
            client?.estado === "Desconectado" || client?.estado === "Exonerado"
          }
          className="flex-1 border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 outline-none disabled:bg-gray-100"
        />
        <button
          onClick={fetchMeses}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Buscar"}
        </button>
      </div>
    </div>
  );
}
