import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import type { Client } from "../types/Clients";

interface Props {
  client: Client;
  setEditingClient: (c: Client | null) => void;
  handleSaveEdit: () => void;
}

export default function ClientRowEdit({ client, setEditingClient, handleSaveEdit }: Props) {
  return (
    <tr className="bg-blue-50"> {/* Fondo suave para destacar la fila de edición */}
      <td className="px-4 py-3 flex flex-col gap-2">
        <Input
          value={client.nombre}
          onChange={(e) => setEditingClient({ ...client, nombre: e.target.value })}
          className="h-10"
        />
        <Input
          value={client.apellido}
          onChange={(e) => setEditingClient({ ...client, apellido: e.target.value })}
          className="h-10"
        />
      </td>
      <td className="px-4 py-3">{client.dui}</td>
      <td className="px-4 py-3 flex gap-2">
        <Input
          type="number"
          min={1}
          max={12}
          value={client.ultimoMes ?? client.lastPayment?.mes ?? 1}
          onChange={(e) => setEditingClient({ ...client, ultimoMes: Number(e.target.value) })}
          className="w-20 h-10"
        />
        <Input
          type="number"
          min={2020}
          value={client.ultimoAnio ?? client.lastPayment?.anio ?? 2025}
          onChange={(e) => setEditingClient({ ...client, ultimoAnio: Number(e.target.value) })}
          className="w-24 h-10"
        />
      </td>
      <td className="px-4 py-3">
        <Select
          value={client.estado}
          onValueChange={(val) => setEditingClient({ ...client, estado: val as Client["estado"] })}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Desconectado">Desconectado</SelectItem>
            <SelectItem value="Exonerado">Exonerado</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-3 flex justify-center gap-4"> {/* gap más grande */}
        <Button onClick={handleSaveEdit} size="icon" className="bg-green-600 hover:bg-green-700 p-2">
          <Save size={18} />
        </Button>
        <Button onClick={() => setEditingClient(null)} size="icon" variant="secondary" className="p-2">
          <X size={18} />
        </Button>
      </td>
    </tr>
  );
}
