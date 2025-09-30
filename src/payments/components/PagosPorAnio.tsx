import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import PagosCliente from "./PagosCliente";
import PagosPorCliente from "./PagosPorCliente";

export interface Pago {
  _id: string;
  mes: number;
  anio: number;
  monto: number;
  client: {
    _id?: string;
    nombre: string;
    apellido: string;
    dui: string;
    estado: string;
  };
}

interface ClienteAtrasado {
  cliente: {
    _id: string;
    nombre: string;
    apellido: string;
    dui: string;
    estado: string;
  };
  ultimoPago: { mes: number; anio: number };
  mesesAtraso: number;
}

export default function PagosPorAnio({ anio }: { anio: number }) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [atrasados, setAtrasados] = useState<ClienteAtrasado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const printRefTodos = useRef<HTMLDivElement>(null);
  const printRefAtrasados = useRef<HTMLDivElement>(null);

  const handlePrintTodos = useReactToPrint({
    contentRef: printRefTodos,
    documentTitle: `Pagos_${anio}`,
    onAfterPrint: () =>
      Swal.fire({
        icon: "success",
        title: "Impresión completada",
        timer: 1500,
        showConfirmButton: false,
      }),
  });

  const handlePrintAtrasados = useReactToPrint({
    contentRef: printRefAtrasados,
    documentTitle: `Pagos_Atrasados_${anio}`,
    onAfterPrint: () =>
      Swal.fire({
        icon: "success",
        title: "Impresión de atrasados completada",
        timer: 1500,
        showConfirmButton: false,
      }),
  });

  useEffect(() => {
    Promise.all([
      api.get(`/payments/anio/${anio}`),
      api.get("/payments/clientes/atrasados"),
    ])
      .then(([resPagos, resAtrasados]) => {
        setPagos(resPagos.data.pagos);
        setAtrasados(resAtrasados.data.atrasados);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al obtener datos");
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

  // Total general excluyendo exonerados
  const totalGeneral = Object.values(pagosPorCliente).reduce(
    (sum, { cliente, pagos }) => {
      if (cliente.estado === "Exonerado") return sum;
      return sum + pagos.reduce((s, p) => s + p.monto, 0);
    },
    0
  );

  // Filtrar clientes por buscador
  const clientesFiltrados = Object.values(pagosPorCliente).filter(
    ({ cliente }) =>
      `${cliente.nombre} ${cliente.apellido}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle className="text-gray-800">Pagos del año {anio}</CardTitle>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;

            if (/^[a-zA-Z0-9\s]*$/.test(value)) {
              setSearch(value);
            }
          }}
          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 🔹 Botones de impresión */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handlePrintTodos}
            className="flex items-center gap-2"
          >
            <Printer size={18} /> Imprimir Todos
          </Button>
          <Button
            onClick={handlePrintAtrasados}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Printer size={18} /> Imprimir Atrasados
          </Button>
        </div>
      </CardHeader>

      {/* 🔹 Contenido oculto para impresión de TODOS */}
      <div className="hidden">
        <div ref={printRefTodos} className="p-4 bg-white">
          <div className="text-center mb-6 border-b pb-2">
            <h1 className="text-2xl font-extrabold text-gray-800">
              Reporte de Pagos {anio}
            </h1>
            <p className="text-gray-600 mt-1">Sistema de Gestión de Pagos</p>
          </div>

          {Object.values(pagosPorCliente).map(
            ({ cliente, pagos }, idx, arr) => (
              <div key={cliente.dui} className="print:break-after-auto">
                <PagosCliente cliente={cliente} pagos={pagos} />
                {(idx + 1) % 2 === 0 && idx !== arr.length - 1 && (
                  <div className="page-break-after" />
                )}
              </div>
            )
          )}

          <div className="mt-6 text-right border-t pt-4">
            <h2 className="text-xl font-bold text-blue-800">
              Total General (excluyendo exonerados): ${totalGeneral.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* 🔹 Contenido oculto para impresión de ATRASADOS desde el backend */}
      <div className="hidden">
        <div ref={printRefAtrasados} className="p-4 bg-white">
          <div className="text-center mb-6 border-b pb-2">
            <h1 className="text-2xl font-extrabold text-red-700">
              Reporte de Clientes Atrasados {anio}
            </h1>
            <p className="text-gray-600 mt-1">Sistema de Gestión de Pagos</p>
          </div>

          {atrasados.length === 0 ? (
            <p className="text-center text-gray-600">
              No hay clientes atrasados 🎉
            </p>
          ) : (
            atrasados.map(({ cliente, mesesAtraso, ultimoPago }, idx, arr) => (
              <div key={cliente.dui} className="print:break-after-auto">
                <div className="mb-6 border rounded-lg p-4 shadow-sm bg-white">
                  <h2 className="text-lg font-bold text-gray-800">
                    {cliente.nombre} {cliente.apellido}
                  </h2>
                  <p className="text-sm text-gray-600">DUI: {cliente.dui}</p>
                  <p className="text-sm text-red-600 font-semibold">
                    Meses de atraso: {mesesAtraso}
                  </p>
                  <p className="text-sm text-gray-500">
                    Último pago: {ultimoPago.mes}/{ultimoPago.anio}
                  </p>
                </div>
                {(idx + 1) % 2 === 0 && idx !== arr.length - 1 && (
                  <div className="page-break-after" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔹 Lista de clientes con botón imprimir individual */}
      <div className="p-4 space-y-2">
        {clientesFiltrados.map(({ cliente }) => (
          <div
            key={cliente.dui}
            className="flex justify-between items-center border-b py-2"
          >
            <span className="text-gray-700 font-medium">
              {cliente.nombre} {cliente.apellido}
            </span>
            <PagosPorCliente
              anio={anio}
              clienteId={cliente._id!}
              nombre={cliente.nombre}
              apellido={cliente.apellido}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
