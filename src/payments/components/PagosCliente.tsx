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
  const totalCliente = pagos.reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="mb-10">
      {/* Encabezado del cliente */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-blue-700">
          {cliente.nombre} {cliente.apellido}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          <span className="mr-4">🆔 DUI: {cliente.dui}</span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              cliente.estado === "al día"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {cliente.estado}
          </span>
        </p>
      </div>

      {/* Tabla de pagos centrada */}
      <div className="max-w-2xl mx-auto overflow-hidden rounded-lg shadow-md border border-gray-200">
        <table className="w-full text-sm text-center">
          <thead className="bg-blue-50 text-blue-700 uppercase text-xs font-semibold">
            <tr>
              <th className="p-3">Mes</th>
              <th className="p-3">Monto</th>
            </tr>
          </thead>
          <tbody>
            {pagos
              .sort((a, b) => a.mes - b.mes)
              .map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-3 border-t">{p.mes}</td>
                  <td className="p-3 border-t font-medium text-green-600">
                    ${p.monto.toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
          {/* Footer con total */}
          <tfoot>
            <tr className="bg-blue-100 font-bold text-blue-800">
              <td className="p-3">Total</td>
              <td className="p-3">${totalCliente.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Divider entre clientes */}
      {!isLast && <hr className="border-t border-gray-300 my-8" />}
    </div>
  );
}
