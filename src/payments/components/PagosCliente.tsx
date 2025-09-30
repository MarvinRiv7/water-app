import type { Pago } from "../types/types";

interface PagosClienteProps {
  cliente: {
    nombre: string;
    apellido: string;
    dui: string;
    estado: string;
  };
  pagos: Pago[];
}

export default function PagosCliente({ cliente, pagos }: PagosClienteProps) {
  const totalCliente = pagos.reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="mb-10 print:break-inside-avoid p-4 border rounded-lg shadow-sm bg-white">
      {/* Encabezado elegante */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {cliente.nombre} {cliente.apellido}
          </h2>
          <p className="text-sm text-gray-500 mt-1">DUI: {cliente.dui}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            cliente.estado === "al día"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {cliente.estado}
        </span>
      </div>

      {/* Tabla elegante */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="p-3 border-b">Mes</th>
              <th className="p-3 border-b text-right">Monto ($)</th>
            </tr>
          </thead>
          <tbody>
            {pagos
              .sort((a, b) => a.anio - b.anio || a.mes - b.mes)
              .map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-b">
                    {p.mes.toString().padStart(2, "0")}/{p.anio}
                  </td>
                  <td className="p-3 border-b text-right font-medium text-gray-800">
                    {p.monto.toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot className="bg-gray-50 font-bold text-gray-800">
            <tr>
              <td className="p-3 border-t">Total</td>
              <td className="p-3 border-t text-right">${totalCliente.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
