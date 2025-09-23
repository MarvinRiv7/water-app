import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { Mes } from "@/types";

type Props = {
  meses: Mes[];
  seleccionados: Mes[];
  toggleMes: (mes: Mes) => void;
};

export default function MesesDisponibles({
  meses,
  seleccionados,
  toggleMes,
}: Props) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const getBadgeClass = (mes: Mes) => {
    if (
      mes.anio < currentYear ||
      (mes.anio === currentYear && mes.mes < currentMonth)
    )
      return "bg-red-100 text-red-700 border border-red-300";
    if (mes.anio === currentYear && mes.mes === currentMonth)
      return "bg-green-100 text-green-700 border border-green-300";
    return "bg-gray-200 text-gray-700 border border-gray-300";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6">
      <h3 className="flex gap-2 items-center text-gray-700 text-lg font-semibold mb-4">
        <Calendar size={18} /> Meses Disponibles
      </h3>
      {meses.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          No hay meses pendientes.
        </p>
      ) : (
        <ul className="space-y-3">
          {meses.map((mes, i) => {
            const isSelected = seleccionados.some(
              (m) => m.mes === mes.mes && m.anio === mes.anio
            );
            return (
              <motion.li
                key={i}
                onClick={() => toggleMes(mes)}
                className={`flex justify-between items-center px-5 py-3 border rounded-xl cursor-pointer transition ${
                  isSelected
                    ? "ring-2 ring-blue-400 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium">
                  {mes.mes}-{mes.anio}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeClass(
                    mes
                  )}`}
                >
                  ${mes.monto}
                </span>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
