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
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-700">{client.nombre} {client.apellido}</td>
      <td className="px-4 py-3 text-gray-600">{client.dui}</td>
      <td className="px-4 py-3 text-gray-600">{client.lastPayment?.mes}/{client.lastPayment?.anio}</td>
      <td className="px-4 py-3">
        <Badge
          variant={
            client.estado === "Activo"
              ? "default"
              : client.estado === "Exonerado"
              ? "secondary"
              : "destructive"
          }
          className="px-3 py-1 text-sm font-medium"
        >
          {client.estado}
        </Badge>
      </td>
      <td className="px-4 py-3 flex justify-center gap-4"> {/* Aumenté el gap */}
        <Button
          onClick={() => setEditingClient(client)}
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 p-2 transition-colors" // más padding
        >
          <Pencil size={18} />
        </Button>
        <ConfirmDeleteDialog onConfirm={() => handleDelete(client._id!)} />
      </td>
    </tr>
  );
}
