// src/payments/components/PagosPorCliente.tsx
import { useRef, useState, useEffect } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import PrintUnCliente from "./PrintUnCliente";

interface PagosPorClienteProps {
  anio: number;
  clienteId: string;
  nombre: string;
  apellido: string;
}

export default function PagosPorCliente({
  anio,
  clienteId,
  nombre,
  apellido,
}: PagosPorClienteProps) {
  const [pagos, setPagos] = useState<any[]>([]);
  const [cliente, setCliente] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Pagos_${anio}_${cliente?.dui}`,
    onAfterPrint: () =>
      Swal.fire({
        icon: "success",
        title: "Impresión completada",
        timer: 1500,
        showConfirmButton: false,
      }),
  });

  // Dispara impresión cuando ya tenemos cliente y pagos
  useEffect(() => {
    if (cliente && pagos.length > 0) {
      handlePrint();
    }
  }, [cliente, pagos, handlePrint]);

  const fetchPagos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/payments/anio/${anio}/client/${clienteId}`
      );
      setCliente(data.cliente);
      setPagos(data.pagos);
    } catch {
      Swal.fire(
        "Error",
        "No se pudieron obtener los pagos del cliente",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={fetchPagos}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Printer size={16} />
        {loading ? "Cargando..." : `Imprimir ${nombre} ${apellido}`}
      </Button>

      {/* Oculto para impresión */}
      <div className="hidden">
        {cliente && pagos.length > 0 && (
          <PrintUnCliente
            ref={printRef}
            anio={anio}
            cliente={cliente}
            pagos={pagos}
          />
        )}
      </div>
    </>
  );
}
