import { useState } from "react";
import { toast } from "react-hot-toast";
import { useClients } from "../hooks/useClients";

import ClientsHeader from "../components/ClientsHeader";
import ClientsTable from "../components/ClientsTable";
import type { Client } from "../types/Clients";
import ClientsSearch from "../components/ClientSearch";

export default function ClientsPage() {
  const { clients, fetchClients, updateClient, deleteClient } = useClients();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveEdit = async () => {
    if (!editingClient) return;

    try {
      const updated = await updateClient(editingClient);

      toast.success(
        updated
          ? `Cliente ${updated.nombre} actualizado con éxito ✅`
          : "Cliente actualizado con éxito ✅"
      );

      setEditingClient(null);
      fetchClients();
    } catch (err: any) {
      let msg = "Error al actualizar cliente";
      if (err.response?.data?.msg) {
        msg = err.response.data.msg;
      }
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClient(id);
      toast.success("Cliente eliminado correctamente 🗑️");
      fetchClients();
    } catch (err: any) {
      let msg = "Error al eliminar cliente";
      if (err.response?.data?.msg) {
        msg = err.response.data.msg;
      }
      toast.error(msg);
    }
  };

  const filteredClients = clients.filter((c) => {
    const query = searchTerm.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(query) ||
      c.apellido.toLowerCase().includes(query) ||
      c.dui.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      {/* Header con logo */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-4">
        <ClientsHeader />

        {/* Logo a la derecha */}
        <img
          src="/logo.jpg" // Asegúrate que el archivo esté en /public/logo.png
          alt="Logo Adesco"
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Buscador */}
      <div className="w-full max-w-6xl mb-4">
        <ClientsSearch value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Tabla */}
      <div className="w-full max-w-6xl overflow-x-auto">
        <ClientsTable
          clients={filteredClients}
          editingClient={editingClient}
          setEditingClient={setEditingClient}
          handleSaveEdit={handleSaveEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
