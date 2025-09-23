import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import PagosCliente from "./PagosCliente";

export interface Pago {
  _id: string;
  mes: number;
  anio: number;
  monto: number;
  client: {
    nombre: string;
    apellido: string;
    dui: string;
    estado: string;
  };
}

export default function PagosPorAnio({ anio }: { anio: number }) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Pagos_${anio}`,
    onAfterPrint: () =>
      Swal.fire({
        icon: "success",
        title: "Impresión completada",
        timer: 1500,
        showConfirmButton: false,
      }),
  });

  useEffect(() => {
    api
      .get(`/payments/anio/${anio}`)
      .then((res) => {
        setPagos(res.data.pagos);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al obtener pagos");
        setLoading(false);
      });
  }, [anio]);

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Agrupar pagos por cliente
  const pagosPorCliente = pagos.reduce((acc, pago) => {
    const key = pago.client.dui;
    if (!acc[key]) {
      acc[key] = { cliente: pago.client, pagos: [] };
    }
    acc[key].pagos.push(pago);
    return acc;
  }, {} as Record<string, { cliente: Pago["client"]; pagos: Pago[] }>);
  // ... resto del código igual

  return (
    <Card className="mt-6">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-gray-800">Pagos del año {anio}</CardTitle>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer size={18} /> Imprimir
        </Button>
      </CardHeader>

      {/* 🔹 Contenido oculto para impresión */}
      <div className="hidden">
        <div ref={printRef}>
          {Object.values(pagosPorCliente).map(
            ({ cliente, pagos }, idx, arr) => (
              <PagosCliente
                key={cliente.dui}
                cliente={cliente}
                pagos={pagos}
                isLast={idx === arr.length - 1}
              />
            )
          )}

          {/* 🔹 Total general */}
          <div className="mt-6 text-right border-t pt-4">
            <h2 className="text-xl font-bold text-blue-800">
              Total General: $
              {pagos.reduce((sum, p) => sum + p.monto, 0).toFixed(2)}
            </h2>
          </div>
        </div>
      </div>
    </Card>
  );
}
