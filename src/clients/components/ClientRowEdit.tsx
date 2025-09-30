import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import type { Client } from "../types/Clients";

interface Props {
  editingClient: Client;
  setEditingClient: (c: Client | null) => void;
  handleSaveEdit: () => void;
}

export default function ClientRowEdit({
  editingClient,
  setEditingClient,
  handleSaveEdit,
}: Props) {
  return (
    <>
      {/* 💻 Versión de tabla (desktop) */}
      <tr className="bg-blue-50 hidden md:table-row">
        {/* Nombre y Apellido */}
        <td className="px-4 py-3 flex flex-col gap-2">
          <Input
            value={editingClient.nombre}
            onChange={(e) =>
              setEditingClient({ ...editingClient, nombre: e.target.value })
            }
            className="h-10"
          />
          <Input
            value={editingClient.apellido}
            onChange={(e) =>
              setEditingClient({ ...editingClient, apellido: e.target.value })
            }
            className="h-10"
          />
        </td>

        {/* DUI */}
        <td className="px-4 py-3">{editingClient.dui}</td>

        {/* Último Pago */}
        <td className="px-4 py-3 flex gap-2">
          <Input
            type="number"
            value={editingClient.ultimoMes ?? editingClient.lastPayment?.mes ?? 1}
            disabled
            className="w-20 h-10 bg-gray-100 cursor-not-allowed"
          />
          <Input
            type="number"
            value={editingClient.ultimoAnio ?? editingClient.lastPayment?.anio ?? 2025}
            disabled
            className="w-24 h-10 bg-gray-100 cursor-not-allowed"
          />
        </td>

        {/* Estado */}
        <td className="px-4 py-3">
          <Select
            value={editingClient.estado}
            onValueChange={(val) =>
              setEditingClient({ ...editingClient, estado: val as Client["estado"] })
            }
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

        {/* Tipo de Pago */}
        <td className="px-4 py-3">
          <Select
            value={editingClient.pagoTipo}
            onValueChange={(val) =>
              setEditingClient({ ...editingClient, pagoTipo: val as Client["pagoTipo"] })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Tipo de Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maximo">Máximo</SelectItem>
              <SelectItem value="medio">Medio</SelectItem>
              <SelectItem value="minimo">Mínimo</SelectItem>
            </SelectContent>
          </Select>
        </td>

        {/* Botones Guardar / Cancelar */}
        <td className="px-4 py-3 flex justify-center gap-4">
          <Button
            onClick={handleSaveEdit}
            size="icon"
            className="bg-green-600 hover:bg-green-700 p-2"
          >
            <Save size={18} />
          </Button>
          <Button
            onClick={() => setEditingClient(null)}
            size="icon"
            variant="secondary"
            className="p-2"
          >
            <X size={18} />
          </Button>
        </td>
      </tr>

      {/* 📱 Versión card (mobile) */}
      <tr className="md:hidden">
        <td colSpan={6} className="px-4 py-3">
          <div className="bg-blue-50 p-4 rounded-xl shadow-sm space-y-3">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 gap-2">
              <Input
                value={editingClient.nombre}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, nombre: e.target.value })
                }
                placeholder="Nombre"
              />
              <Input
                value={editingClient.apellido}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, apellido: e.target.value })
                }
                placeholder="Apellido"
              />
            </div>

            {/* DUI */}
            <p className="text-sm text-gray-700">
              <span className="font-semibold">DUI:</span> {editingClient.dui}
            </p>

            {/* Último Pago */}
            <div className="flex gap-2">
              <Input
                type="number"
                value={editingClient.ultimoMes ?? editingClient.lastPayment?.mes ?? 1}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <Input
                type="number"
                value={editingClient.ultimoAnio ?? editingClient.lastPayment?.anio ?? 2025}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Estado */}
            <Select
              value={editingClient.estado}
              onValueChange={(val) =>
                setEditingClient({ ...editingClient, estado: val as Client["estado"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Desconectado">Desconectado</SelectItem>
                <SelectItem value="Exonerado">Exonerado</SelectItem>
              </SelectContent>
            </Select>

            {/* Tipo de Pago */}
            <Select
              value={editingClient.pagoTipo}
              onValueChange={(val) =>
                setEditingClient({ ...editingClient, pagoTipo: val as Client["pagoTipo"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maximo">Máximo</SelectItem>
                <SelectItem value="medio">Medio</SelectItem>
                <SelectItem value="minimo">Mínimo</SelectItem>
              </SelectContent>
            </Select>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
              >
                <Save size={16} /> Guardar
              </Button>
              <Button
                onClick={() => setEditingClient(null)}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <X size={16} /> Cancelar
              </Button>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
