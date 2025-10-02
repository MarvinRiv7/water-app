import { Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const maxYear = 2028;
  const mesesFiltrados = meses.filter((mes) => mes.anio <= maxYear);

  const getBadgeVariant = (mes: Mes) => {
    if (
      mes.anio < currentYear ||
      (mes.anio === currentYear && mes.mes < currentMonth)
    )
      return "destructive"; // rojo
    if (mes.anio === currentYear && mes.mes === currentMonth) return "default"; // verde
    return "secondary"; // gris
  };

  const getStatusIcon = (mes: Mes) => {
    if (
      mes.anio < currentYear ||
      (mes.anio === currentYear && mes.mes < currentMonth)
    )
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (mes.anio === currentYear && mes.mes === currentMonth)
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  const formatMonth = (mes: number) =>
    new Date(0, mes - 1).toLocaleString("es-ES", { month: "long" });

  return (
    <Card className="rounded-2xl shadow-lg border bg-white/80 backdrop-blur-md">
      <CardHeader className="flex items-center gap-2 pb-3 border-b">
        <Calendar className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg font-semibold text-gray-700">
          Meses Disponibles
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3">
        {mesesFiltrados.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No hay meses pendientes.
          </p>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mesesFiltrados.slice(0, 8).map((mes, i) => {
                const isSelected = seleccionados.some(
                  (m) => m.mes === mes.mes && m.anio === mes.anio
                );
                return (
                  <motion.div
                    key={i}
                    onClick={() => toggleMes(mes)}
                    className={`flex flex-col items-start gap-2 rounded-xl p-3 cursor-pointer border shadow-sm transition
                      ${
                        isSelected
                          ? "bg-primary/10 border-primary ring-2 ring-primary/40"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(mes)}
                      <span className="capitalize font-medium text-gray-700">
                        {formatMonth(mes.mes)} {mes.anio}
                      </span>
                    </div>
                    <Badge
                      variant={getBadgeVariant(mes)}
                      className="text-xs px-2 py-0.5"
                    >
                      {mes.mora > 0
                        ? `$${mes.base} + $${mes.mora} = $${mes.monto}`
                        : `$${mes.monto}`}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
