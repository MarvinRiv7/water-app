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
      className="mt-8 bg-gradient-to-r from-green-100 to-green-200 border border-green-400 p-5 rounded-2xl shadow-lg flex justify-between items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="font-semibold text-green-700">
        Total a pagar: <span className="text-xl font-bold">${totalPagar}</span>
      </p>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="flex gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow disabled:opacity-50 items-center transition"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Wallet size={18} />
        )}
        {loading ? "Procesando..." : "Pagar Seleccionados"}
      </button>
    </motion.div>
  );
}
