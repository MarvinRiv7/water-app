import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ClientRow from "./ClientRow";
import ClientRowEdit from "./ClientRowEdit";
import type { Client } from "../types/Clients";

interface Props {
  clients: Client[];
  editingClient: Client | null;
  setEditingClient: (c: Client | null) => void;
  handleSaveEdit: () => void;
  handleDelete: (id: string) => void;
}

export default function ClientsTable({
  clients,
  editingClient,
  setEditingClient,
  handleSaveEdit,
  handleDelete,
}: Props) {
  return (
    <Card className="shadow-md border border-gray-200 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-700">
          Lista de clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-max w-full">
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>DUI</TableHead>
                  <TableHead>Último Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tipo de Pago</TableHead>
                  <TableHead>Observaciones</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {clients.map((c) =>
                  editingClient && editingClient._id === c._id ? (
                    <ClientRowEdit
                      key={c._id}
                      editingClient={editingClient}
                      setEditingClient={setEditingClient}
                      handleSaveEdit={handleSaveEdit}
                    />
                  ) : (
                    <ClientRow
                      key={c._id}
                      client={c}
                      setEditingClient={setEditingClient}
                      handleDelete={handleDelete}
                    />
                  )
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">
            <p className="text-lg">No se encontraron clientes</p>
            <p className="text-sm">
              Intenta con otro nombre, apellido o número de DUI 🔍
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
