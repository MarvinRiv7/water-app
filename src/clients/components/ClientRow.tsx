import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import dayjs from "dayjs";

import type { Client } from "../types/Clients";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

interface Props {
  client: Client;
  setEditingClient: (c: Client) => void;
  handleDelete: (id: string) => void;
}

export default function ClientRow({
  client,
  setEditingClient,
  handleDelete,
}: Props) {
  const hoy = dayjs();

  // Último pago registrado (si existe)
  const ultimoPago = client.lastPayment
    ? dayjs(`${client.lastPayment.anio}-${client.lastPayment.mes}-01`)
    : null;

  // Mes anterior al actual
  const mesAnterior = hoy.subtract(1, "month").startOf("month");

  // Un cliente está al día si su último pago es >= mes anterior
  const alDia = ultimoPago ? !ultimoPago.isBefore(mesAnterior) : false;

  // 🧠 Función para dividir texto largo en saltos de línea cada 15 palabras
  const dividirTexto = (texto?: string) => {
    if (!texto) return "";
    const palabras = texto.split(" ");
    const bloques = [];
    for (let i = 0; i < palabras.length; i += 15) {
      bloques.push(palabras.slice(i, i + 15).join(" "));
    }
    return bloques.map((b, i) => (
      <span key={i}>
        {b}
        <br />
      </span>
    ));
  };

  return (
    <>
      {/* 💻 Desktop */}
      <tr className="hidden md:table-row hover:bg-blue-50 transition-colors">
        <td className="px-4 py-3 font-medium text-gray-700">
          {client.nombre} {client.apellido}
        </td>

        {/* Referencia */}
        <td className="px-4 py-3 text-gray-600 font-bold break-words max-w-xs">
          {client.referencia || <span className="text-gray-400 italic">—</span>}
        </td>

        {/* DUI */}
        <td className="px-4 py-3 text-gray-600">{client.dui}</td>

        {/* Último pago */}
        <td
          className={`px-4 py-3 ${
            alDia
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }`}
        >
          {client.lastPayment?.mes}/{client.lastPayment?.anio}
        </td>

        {/* Estado */}
        <td className="px-4 py-3">
          <Badge
            variant={
              client.estado === "Activo"
                ? "green"
                : client.estado === "Exonerado"
                ? "default"
                : "destructive"
            }
            className="px-3 py-1 text-sm font-medium"
          >
            {client.estado}
          </Badge>
        </td>

        {/* Tipo de pago */}
        <td className="px-4 py-3">
          <Badge
            variant={
              client.pagoTipo === "maximo"
                ? "green"
                : client.pagoTipo === "medio"
                ? "default"
                : "blue"
            }
            className="px-3 py-1 text-sm font-medium"
          >
            {client.pagoTipo.charAt(0).toUpperCase() + client.pagoTipo.slice(1)}
          </Badge>
        </td>

        {/* Observaciones */}
        <td className="px-4 py-3 text-gray-600 font-bold break-words max-w-xs">
          
          {client.observaciones || (
            <span className="text-gray-400 italic">—</span>
          )}
        </td>

        {/* Botones */}
        <td className="px-4 py-3 flex justify-center gap-4">
          <Button
            onClick={() => setEditingClient(client)}
            size="icon"
            className="bg-blue-400 hover:bg-blue-700 p-2 transition-colors"
          >
            <Pencil size={18} />
          </Button>
          <ConfirmDeleteDialog onConfirm={() => handleDelete(client._id!)} />
        </td>
      </tr>

      {/* 📱 Mobile */}
      <tr className="md:hidden">
        <td colSpan={8} className="p-3">
          <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
            <div className="font-semibold text-gray-800">
              {client.nombre} {client.apellido}
            </div>
            <div className="text-gray-600">DUI: {client.dui}</div>

            {client.referencia && (
              <div className="text-gray-600 whitespace-pre-wrap break-words">
                Referencia: {dividirTexto(client.referencia)}
              </div>
            )}

            <div
              className={`${
                alDia
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }`}
            >
              Último pago: {client.lastPayment?.mes}/{client.lastPayment?.anio}
            </div>

            <div className="flex gap-2">
              <Badge>{client.estado}</Badge>
              <Badge>
                {client.pagoTipo.charAt(0).toUpperCase() +
                  client.pagoTipo.slice(1)}
              </Badge>
            </div>

            {client.observaciones && (
              <div className="text-gray-600 whitespace-pre-wrap break-words">
                Observaciones: {dividirTexto(client.observaciones)}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-2">
              <Button
                onClick={() => setEditingClient(client)}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 p-2"
              >
                <Pencil size={18} />
              </Button>
              <ConfirmDeleteDialog
                onConfirm={() => handleDelete(client._id!)}
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
