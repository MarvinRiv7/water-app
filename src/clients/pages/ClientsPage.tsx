import { useState } from "react";
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
    await updateClient(editingClient);
    setEditingClient(null);
    fetchClients();
  };

  const handleDelete = async (id: string) => {
    await deleteClient(id);
    fetchClients();
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
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <ClientsHeader />
      <ClientsSearch value={searchTerm} onChange={setSearchTerm} />
      <ClientsTable
        clients={filteredClients}
        editingClient={editingClient}
        setEditingClient={setEditingClient}
        handleSaveEdit={handleSaveEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}
