import type { Pago } from "../types/types";

interface PagosClienteProps {
  cliente: {
    nombre: string;
    apellido: string;
    dui: string;
    estado: string;
  };
  pagos: Pago[];
  isLast: boolean;
}

export default function PagosCliente({
  cliente,
  pagos,
  isLast,
}: PagosClienteProps) {
  return (
    <div className="mb-8">
      {/* Encabezado del cliente */}
      <h2 className="text-lg font-bold text-blue-700 mb-2">
        {cliente.nombre} {cliente.apellido}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        <span className="mr-4">DUI: {cliente.dui}</span>
        <span>Estado: {cliente.estado}</span>
      </p>

      {/* Tabla de pagos */}
      <table className="w-full border-collapse border border-gray-200 text-sm mb-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Mes</th>
            <th className="p-2 border">Monto</th>
          </tr>
        </thead>
        <tbody>
          {pagos
            .sort((a, b) => a.mes - b.mes)
            .map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="p-2 border">{p.mes}</td>
                <td className="p-2 border font-semibold text-green-600">
                  ${p.monto.toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Divider */}
      {!isLast && <hr className="border-t-2 border-gray-300 my-6" />}
    </div>
  );
}
