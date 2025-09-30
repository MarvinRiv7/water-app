// src/payments/components/PrintUnCliente.tsx
import { forwardRef } from "react";
import PagosCliente from "./PagosCliente";
import type { Pago } from "../types/types";

interface PrintUnClienteProps {
  anio: number;
  cliente: {
    _id?: string;
    nombre: string;
    apellido: string;
    dui: string;
    estado: string;
  };
  pagos: {
    mes: number;
    pago: {
      _id: string;
      monto: number;
    };
  }[];
}

const PrintUnCliente = forwardRef<HTMLDivElement, PrintUnClienteProps>(
  ({ anio, cliente, pagos }, ref) => {
    // 🔹 Convertir pagos al formato que espera PagosCliente
    const pagosFormateados: Pago[] = pagos.map(p => ({
      _id: p.pago._id,
      mes: p.mes,
      anio: anio,
      monto: p.pago.monto ?? 0,
      client: {
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        dui: cliente.dui,
        estado: cliente.estado
      }
    }));

    return (
      <div ref={ref} className="p-4 bg-white">
        {/* Encabezado */}
        <div className="text-center mb-6 border-b pb-2">
          <h1 className="text-2xl font-extrabold text-gray-800">
            Reporte de Pagos {anio}
          </h1>
          <p className="text-gray-600 mt-1">Sistema de Gestión de Pagos</p>
        </div>

        {/* Cliente con sus pagos */}
        <PagosCliente cliente={cliente} pagos={pagosFormateados} />
      </div>
    );
  }
);

export default PrintUnCliente;
