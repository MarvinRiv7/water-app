import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const ITEMS_PER_PAGE = 10;

export default function ClientsTable({
  clients,
  editingClient,
  setEditingClient,
  handleSaveEdit,
  handleDelete,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentClients = clients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Mostrar solo las primeras, últimas y cercanas
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - 2 && i > 1) ||
        (i === currentPage + 2 && i < totalPages)
      ) {
        pages.push("...");
      }
    }

    return pages.map((p, i) =>
      typeof p === "number" ? (
        <Button
          key={i}
          size="sm"
          variant={p === currentPage ? "default" : "outline"}
          className={cn(
            "mx-1 rounded-full text-sm w-8 h-8",
            p === currentPage
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "text-gray-600 hover:bg-blue-50"
          )}
          onClick={() => handlePageChange(p)}
        >
          {p}
        </Button>
      ) : (
        <span key={i} className="mx-2 text-gray-400">
          {p}
        </span>
      )
    );
  };

  return (
    <Card className="shadow-md border border-gray-200 rounded-2xl">
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-base md:text-lg font-semibold text-blue-700">
          Lista de clientes
        </CardTitle>
      </CardHeader>

      <CardContent className="py-2 px-1">
        {clients.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-max w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-blue-100 text-xs md:text-sm">
                    <TableHead className="px-2 py-1">Nombre</TableHead>
                    <TableHead className="px-2 py-1">Ref.</TableHead>
                    <TableHead className="px-2 py-1">DUI</TableHead>
                    <TableHead className="px-2 py-1">Últ. Pago</TableHead>
                    <TableHead className="px-2 py-1">Estado</TableHead>
                    <TableHead className="px-2 py-1">Tipo</TableHead>
                    <TableHead className="px-2 py-1">Obs.</TableHead>
                    <TableHead className="px-2 py-1 text-center">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="text-sm">
                  {currentClients.map((c) =>
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

            {/* 🌟 PAGINACIÓN BONITA */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
              <span className="text-gray-500 text-sm">
                Mostrando {startIndex + 1} -{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, clients.length)} de{" "}
                {clients.length}
              </span>

              <div className="flex items-center justify-center">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full mx-1"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {renderPageNumbers()}

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full mx-1"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm md:text-base">
            <p className="font-medium">No se encontraron clientes</p>
            <p>Intenta con otro nombre, apellido o número de DUI 🔍</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
