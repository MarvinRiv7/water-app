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
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (mes.anio === currentYear && mes.mes === currentMonth)
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const formatMonth = (mes: number) =>
    new Date(0, mes - 1).toLocaleString("es-ES", { month: "short" });

  return (
    <Card className="rounded-2xl shadow-md border">
      <CardHeader className="flex items-center gap-2 pb-3">
        <Calendar className="h-5 w-5 text-gray-600" />
        <CardTitle className="text-lg text-gray-700">
          Meses Disponibles
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2">
        {mesesFiltrados.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No hay meses pendientes.
          </p>
        ) : (
          <ScrollArea className="max-h-72">
            <ul className="flex flex-wrap gap-2">
              {mesesFiltrados.slice(0, 12).map((mes, i) => {
                const isSelected = seleccionados.some(
                  (m) => m.mes === mes.mes && m.anio === mes.anio
                );
                return (
                  <motion.li
                    key={i}
                    onClick={() => toggleMes(mes)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer border transition text-sm ${
                      isSelected
                        ? "bg-primary/20 border-primary ring-1 ring-primary/50"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {getStatusIcon(mes)}
                    <span className="capitalize font-medium">
                      {formatMonth(mes.mes)} {mes.anio}
                    </span>
                    <Badge
                      variant={getBadgeVariant(mes)}
                      className="text-xs px-2 py-0.5"
                    >
                      {mes.mora > 0
                        ? `$${mes.base} + $${mes.mora} = $${mes.monto}`
                        : `$${mes.monto}`}
                    </Badge>
                  </motion.li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
