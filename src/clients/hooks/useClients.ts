import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Client } from "../types/Clients";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Obtener clientes
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients");

      // aseguramos array
      const clientsData: Client[] = Array.isArray(res.data)
        ? res.data
        : res.data.clients || res.data.client || [];

      // 🔹 Añadir lastPayment y pagoTipo si no existen
      const clientsWithLastPayment = clientsData.map((c) => ({
        ...c,
        ultimoMes: c.ultimoMes ?? 1,
        ultimoAnio: c.ultimoAnio ?? 2025,
        pagoTipo: c.pagoTipo || "maximo",
        lastPayment: c.lastPayment || {
          mes: c.ultimoMes ?? 1,
          anio: c.ultimoAnio ?? 2025,
        },
        estado: c.estado || "Activo",
      }));

      setClients(clientsWithLastPayment);
    } catch (error) {
      console.error("Error al obtener clientes", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };
const updateClient = async (client: Client) => {
  if (!client._id) return;

  // ✅ Solo enviar los campos editables
  const dataToUpdate = {
    nombre: client.nombre,
    apellido: client.apellido,
    estado: client.estado,
    pagoTipo: client.pagoTipo,
  };

  const res = await api.put(`/clients/${client._id}`, dataToUpdate);

  // Aseguramos lastPayment y pagoTipo en la respuesta
  const updatedClient: Client = {
    ...res.data.client,
    ultimoMes: res.data.client.ultimoMes ?? 1,
    ultimoAnio: res.data.client.ultimoAnio ?? 2025,
    pagoTipo: res.data.client.pagoTipo || "maximo",
    lastPayment:
      res.data.client.lastPayment || {
        mes: res.data.client.ultimoMes ?? 1,
        anio: res.data.client.ultimoAnio ?? 2025,
      },
    estado: res.data.client.estado || "Activo",
  };

  // actualizar en el state
  setClients((prev) =>
    prev.map((c) => (c._id === updatedClient._id ? updatedClient : c))
  );

  return updatedClient;
};


  // 🔹 Eliminar cliente
  const deleteClient = async (id: string) => {
    await api.delete(`/clients/${id}`);
    setClients((prev) => prev.filter((c) => c._id !== id));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, fetchClients, updateClient, deleteClient };
}
