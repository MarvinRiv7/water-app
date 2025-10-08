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

  const ultimoPago = client.lastPayment
    ? dayjs(`${client.lastPayment.anio}-${client.lastPayment.mes}-01`)
    : null;

  const mesAnterior = hoy.subtract(1, "month").startOf("month");
  const alDia = ultimoPago ? !ultimoPago.isBefore(mesAnterior) : false;

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
      {/* 💻 Desktop – tabla compacta */}
      <tr className="hidden md:table-row hover:bg-blue-50 transition-colors text-sm">
        <td className="px-2 py-1 font-medium text-gray-700">
          {client.nombre} {client.apellido}
        </td>

        <td className="px-2 py-1 text-gray-600 font-bold break-words max-w-xs">
          {client.referencia || <span className="text-gray-400 italic">—</span>}
        </td>

        <td className="px-2 py-1 text-gray-600">{client.dui}</td>

        <td
          className={`px-2 py-1 ${
            alDia ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
          }`}
        >
          {client.lastPayment?.mes}/{client.lastPayment?.anio}
        </td>

        <td className="px-2 py-1">
          <Badge
            variant={
              client.estado === "Activo"
                ? "green"
                : client.estado === "Exonerado"
                ? "default"
                : "destructive"
            }
            className="px-2 py-1 text-xs font-medium"
          >
            {client.estado}
          </Badge>
        </td>

        <td className="px-2 py-1">
          <Badge
            variant={
              client.pagoTipo === "maximo"
                ? "green"
                : client.pagoTipo === "medio"
                ? "default"
                : "blue"
            }
            className="px-2 py-1 text-xs font-medium"
          >
            {client.pagoTipo.charAt(0).toUpperCase() + client.pagoTipo.slice(1)}
          </Badge>
        </td>

        <td className="px-2 py-1 text-gray-600 break-words max-w-xs">
          {client.observaciones || <span className="text-gray-400 italic">—</span>}
        </td>

        <td className="px-2 py-1 flex justify-center gap-2">
          <Button
            onClick={() => setEditingClient(client)}
            size="icon"
            className="bg-blue-400 hover:bg-blue-700 p-1"
          >
            <Pencil size={16} />
          </Button>
          <ConfirmDeleteDialog onConfirm={() => handleDelete(client._id!)} />
        </td>
      </tr>

      {/* 📱 Mobile – tarjetas compactas */}
      <tr className="md:hidden">
        <td colSpan={8} className="p-2">
          <div className="bg-white shadow rounded-lg p-3 flex flex-col gap-1 text-sm">
            <div className="font-semibold text-gray-800">
              {client.nombre} {client.apellido}
            </div>

            <div className="text-gray-600">
              DUI: {client.dui}
            </div>

            {client.referencia && (
              <div className="text-gray-600 break-words whitespace-pre-wrap">
                Referencia: {dividirTexto(client.referencia)}
              </div>
            )}

            <div className={alDia ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              Último pago: {client.lastPayment?.mes}/{client.lastPayment?.anio}
            </div>

            <div className="flex gap-1 flex-wrap">
              <Badge className="px-2 py-1 text-xs">{client.estado}</Badge>
              <Badge className="px-2 py-1 text-xs">
                {client.pagoTipo.charAt(0).toUpperCase() + client.pagoTipo.slice(1)}
              </Badge>
            </div>

            {client.observaciones && (
              <div className="text-gray-600 break-words whitespace-pre-wrap">
                Observaciones: {dividirTexto(client.observaciones)}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-1">
              <Button
                onClick={() => setEditingClient(client)}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 p-1"
              >
                <Pencil size={16} />
              </Button>
              <ConfirmDeleteDialog onConfirm={() => handleDelete(client._id!)} />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
