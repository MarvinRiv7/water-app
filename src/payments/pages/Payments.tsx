import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AxiosError } from "axios";
import SearchClient from "../components/SearchClient";
import MesesDisponibles from "../components/MesesDisponibles";
import ResumenPago from "../components/ResumenPago";
import { AlertMsgDialog, ConfirmDialog } from "../components/Dialogs";
import type { Mes, Client } from "@/types";

export default function Payments() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [mesesDisponibles, setMesesDisponibles] = useState<Mes[]>([]);
  const [seleccionados, setSeleccionados] = useState<Mes[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [coincidencias, setCoincidencias] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔹 Buscar cliente y meses
  const fetchMeses = async () => {
    if (!searchValue.trim())
      return setAlertMsg("Ingrese un DUI o Nombre válido");

    setLoading(true);
    setClient(null);
    setMesesDisponibles([]);
    setSeleccionados([]);
    setCoincidencias([]);

    try {
      const res = await api.get(`/payments/meses-disponibles`, {
        params: searchValue.includes("-")
          ? { dui: searchValue }
          : { nombre: searchValue },
      });

      if (res.data.coincidencias) {
        // 🔹 Se encontraron varios clientes
        setCoincidencias(res.data.coincidencias);
        return;
      }

      if (res.data.cliente) setClient(res.data.cliente);
      if (res.data.mesesDisponibles)
        setMesesDisponibles(res.data.mesesDisponibles);
    } catch (error) {
      const err = error as AxiosError<{ msg?: string }>;
      setAlertMsg(err.response?.data?.msg || "Error al cargar cliente o meses");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Seleccionar cliente de coincidencias
  const seleccionarCliente = async (c: Client) => {
    setClient(c);
    setCoincidencias([]);
    try {
      const resMeses = await api.get(`/payments/meses-disponibles`, {
        params: { dui: c.dui },
      });
      setMesesDisponibles(resMeses.data.mesesDisponibles);
    } catch {
      setAlertMsg("Error al cargar meses del cliente seleccionado");
    }
  };

  // 🔹 Selección de meses
  const toggleMes = (mes: Mes) => {
    setSeleccionados((prev) =>
      prev.some((m) => m.mes === mes.mes && m.anio === mes.anio)
        ? prev.filter((m) => !(m.mes === mes.mes && m.anio === mes.anio))
        : [...prev, mes]
    );
  };

  // 🔹 Pago
  const handlePay = async () => {
    setShowConfirm(false);
    if (!client || client.estado !== "Activo") return;
    if (seleccionados.length === 0)
      return setAlertMsg("Seleccione al menos un mes");

    setLoading(true);
    try {
      const mesesOrdenados = seleccionados.sort((a, b) =>
        a.anio === b.anio ? a.mes - b.mes : a.anio - b.anio
      );

      const res = await api.post(
        `/payments/${client.dui}/pagar-seleccion`,
        { meses: mesesOrdenados },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "factura.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setAlertMsg("Pago realizado con éxito ✅");
      window.dispatchEvent(new Event("statsUpdated"));

      await fetchMeses();
      setSeleccionados([]);
    } catch (error) {
      const err = error as AxiosError<{ msg?: string }>;
      setAlertMsg(err.response?.data?.msg || "Error al procesar pago ❌");
    } finally {
      setLoading(false);
    }
  };

  const totalPagar = seleccionados.reduce((acc, m) => acc + m.monto, 0);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate("/")}
          className="flex gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} /> Volver
        </button>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800">
          Gestión de Pagos
        </h2>
        <div />
        <img
          src="/logo.jpg" // Asegúrate de tener /public/logo.jpg
          alt="Logo Adesco"
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Buscar cliente */}
      <SearchClient
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        client={client}
        loading={loading}
        fetchMeses={fetchMeses}
      />

      {/* Si hay coincidencias, mostrar lista */}
      {coincidencias.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h4 className="text-gray-700 font-semibold mb-2">
            Seleccione un cliente:
          </h4>
          <ul className="divide-y">
            {coincidencias.map((c) => (
              <li
                key={c.dui}
                className="p-2 cursor-pointer hover:bg-blue-50 rounded transition"
                onClick={() => seleccionarCliente(c)}
              >
                <p className="font-medium">
                  {c.nombre} {c.apellido}
                </p>
                <p className="text-sm text-gray-500">
                  DUI: {c.dui} — {c.estado}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meses disponibles */}
      <MesesDisponibles
        meses={mesesDisponibles}
        seleccionados={seleccionados}
        toggleMes={toggleMes}
      />

      {/* Resumen y pagar */}
      <ResumenPago
        totalPagar={totalPagar}
        seleccionados={seleccionados}
        client={client}
        loading={loading}
        onConfirm={() => setShowConfirm(true)}
      />

      {/* Diálogos */}
      <AlertMsgDialog alertMsg={alertMsg} onClose={() => setAlertMsg(null)} />
      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handlePay}
        total={totalPagar}
      />
    </motion.div>
  );
}
