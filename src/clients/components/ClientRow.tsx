import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";

import type { Client } from "../types/Clients";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

interface Props {
  client: Client;
  setEditingClient: (c: Client) => void;
  handleDelete: (id: string) => void;
}
export default function ClientRow({ client, setEditingClient, handleDelete }: Props) {
  return (
    <>
      {/* Desktop */}
      <tr className="hidden md:table-row hover:bg-blue-50 transition-colors">
        <td className="px-4 py-3 font-medium text-gray-700">
          {client.nombre} {client.apellido}
        </td>
        <td className="px-4 py-3 text-gray-600">{client.dui}</td>
        <td className="px-4 py-3 text-gray-600">
          {client.lastPayment?.mes}/{client.lastPayment?.anio}
        </td>
        <td className="px-4 py-3">
          <Badge
            variant={
              client.estado === "Activo"
                ? "outline"
                : client.estado === "Exonerado"
                ? "default"
                : "destructive"
            }
            className="px-3 py-1 text-sm font-medium"
          >
            {client.estado}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <Badge
            variant={
              client.pagoTipo === "maximo"
                ? "outline"
                : client.pagoTipo === "medio"
                ? "default"
                : "destructive"
            }
            className="px-3 py-1 text-sm font-medium"
          >
            {client.pagoTipo.charAt(0).toUpperCase() + client.pagoTipo.slice(1)}
          </Badge>
        </td>
        <td className="px-4 py-3 flex justify-center gap-4">
          <Button
            onClick={() => setEditingClient(client)}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 p-2 transition-colors"
          >
            <Pencil size={18} />
          </Button>
          <ConfirmDeleteDialog onConfirm={() => handleDelete(client._id!)} />
        </td>
      </tr>

      {/* Mobile (card) */}
      <tr className="md:hidden">
        <td colSpan={6} className="p-3">
          <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
            <div className="font-semibold text-gray-800">
              {client.nombre} {client.apellido}
            </div>
            <div className="text-gray-600">DUI: {client.dui}</div>
            <div className="text-gray-600">
              Último pago: {client.lastPayment?.mes}/{client.lastPayment?.anio}
            </div>
            <div className="flex gap-2">
              <Badge>{client.estado}</Badge>
              <Badge>
                {client.pagoTipo.charAt(0).toUpperCase() +
                  client.pagoTipo.slice(1)}
              </Badge>
            </div>
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

