import type { Mes, Client } from "@/types";
import { motion } from "framer-motion";
import { Wallet, Loader2 } from "lucide-react";

type Props = {
  totalPagar: number;
  seleccionados: Mes[];
  client: Client | null;
  loading: boolean;
  onConfirm: () => void;
};

export default function ResumenPago({
  totalPagar,
  seleccionados,
  client,
  loading,
  onConfirm,
}: Props) {
  if (seleccionados.length === 0 || client?.estado !== "Activo") return null;

  return (
    <motion.div
      className="mt-6 p-5 rounded-2xl shadow-xl bg-gradient-to-tr from-green-50 via-green-100 to-green-200 border border-green-300 flex flex-col sm:flex-row justify-between items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Información del pago */}
      <div className="flex items-center gap-3">
        <Wallet size={28} className="text-green-600" />
        <div>
          <p className="text-green-800 font-semibold">Total a pagar</p>
          <p className="text-2xl font-bold text-green-900">${totalPagar}</p>
        </div>
      </div>

      {/* Botón de pago */}
      <button
        onClick={onConfirm}
        disabled={loading}
        className="flex gap-3 items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Wallet size={20} />
        )}
        {loading ? "Procesando..." : "Pagar Seleccionados"}
      </button>
    </motion.div>
  );
}
