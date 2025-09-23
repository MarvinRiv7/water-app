// src/clients/pages/Payments.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import dayjs from "dayjs";
import { calcularMonto } from "../../utils/payments";

// ✅ lucide-react
import { ArrowLeft, Search, Wallet, Calendar, Loader2 } from "lucide-react";

// ✅ framer-motion
import { motion } from "framer-motion";

// ✅ axios
import { AxiosError } from "axios";

// ✅ shadcn/ui AlertDialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Mes = {
  mes: number;
  anio: number;
  monto: number;
};

type Client = {
  dui: string;
  estado: "Activo" | "Desconectado" | "Exonerado";
  ultimoMes: number;
  ultimoAnio: number;
};

export default function Payments() {
  const navigate = useNavigate();

  const [clientDui, setClientDui] = useState("");
  const [mesesDisponibles, setMesesDisponibles] = useState<Mes[]>([]);
  const [seleccionados, setSeleccionados] = useState<Mes[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 AlertDialog shadcn
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchMeses = async () => {
    if (!clientDui.trim()) return setAlertMsg("Ingrese un DUI válido");

    setLoading(true);
    try {
      const resCliente = await api.get<{ client: Client }>(
        `/clients/${clientDui}`
      );
      const clienteData = resCliente.data.client;
      setClient(clienteData);

      if (clienteData.estado !== "Activo") {
        setMesesDisponibles([]);
        setSeleccionados([]);
        return setAlertMsg(
          `El cliente está ${clienteData.estado} y no puede realizar pagos`
        );
      }

      const resMeses = await api.get<{
        mesesDisponibles: { mes: number; anio: number }[];
      }>(`/payments/${clientDui}/meses-disponibles`);

      const hoy = dayjs();
      const ultimoPago = dayjs(
        `${clienteData.ultimoAnio}-${clienteData.ultimoMes}-01`
      );

      const mesesConMonto: Mes[] = resMeses.data.mesesDisponibles.map((m) => {
        const monto = calcularMonto(m.anio, m.mes, ultimoPago, hoy);
        return { ...m, monto };
      });

      setMesesDisponibles(mesesConMonto);
      setSeleccionados([]);
    } catch (error) {
      const err = error as AxiosError<{ msg?: string }>;
      setAlertMsg(err.response?.data?.msg || "Error al cargar cliente o meses");
    } finally {
      setLoading(false);
    }
  };

  const toggleMes = (mes: Mes) => {
    setSeleccionados((prev) =>
      prev.some((m) => m.mes === mes.mes && m.anio === mes.anio)
        ? prev.filter((m) => !(m.mes === mes.mes && m.anio === mes.anio))
        : [...prev, mes]
    );
  };

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
        `/payments/${clientDui}/pagar-seleccion`,
        { meses: mesesOrdenados },
        { responseType: "blob" }
      );

      // Descargar PDF
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "factura.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setAlertMsg("Pago realizado con éxito ✅");
      window.dispatchEvent(new Event("statsUpdated"));

      setClientDui("");
      setMesesDisponibles([]);
      setSeleccionados([]);
      setClient(null);
    } catch (error) {
      const err = error as AxiosError<{ msg?: string }>;
      setAlertMsg(err.response?.data?.msg || "Error al procesar pago ❌");
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const getBadgeClass = (mes: Mes) => {
    if (
      mes.anio < currentYear ||
      (mes.anio === currentYear && mes.mes < currentMonth)
    )
      return "bg-red-100 text-red-700 border border-red-300";
    if (mes.anio === currentYear && mes.mes === currentMonth)
      return "bg-green-100 text-green-700 border border-green-300";
    return "bg-gray-200 text-gray-700 border border-gray-300";
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
      </div>

      {/* Buscar cliente */}
      <div className="bg-white rounded-2xl shadow-md border p-6 mb-8">
        <h3 className="flex gap-2 items-center text-gray-700 text-lg font-semibold mb-4">
          <Search size={18} /> Buscar Cliente
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ingrese DUI del cliente"
            value={clientDui}
            onChange={(e) => setClientDui(e.target.value)}
            disabled={
              client?.estado === "Desconectado" ||
              client?.estado === "Exonerado"
            }
            className="flex-1 border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 outline-none disabled:bg-gray-100"
          />
          <button
            onClick={fetchMeses}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Buscar"
            )}
          </button>
        </div>
      </div>

      {/* Meses disponibles */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="flex gap-2 items-center text-gray-700 text-lg font-semibold mb-4">
          <Calendar size={18} /> Meses Disponibles
        </h3>
        {mesesDisponibles.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No hay meses pendientes.
          </p>
        ) : (
          <ul className="space-y-3">
            {mesesDisponibles.map((mes, i) => {
              const isSelected = seleccionados.some(
                (m) => m.mes === mes.mes && m.anio === mes.anio
              );
              return (
                <motion.li
                  key={i}
                  onClick={() => toggleMes(mes)}
                  className={`flex justify-between items-center px-5 py-3 border rounded-xl cursor-pointer transition ${
                    isSelected
                      ? "ring-2 ring-blue-400 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium">
                    {mes.mes}-{mes.anio}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeClass(
                      mes
                    )}`}
                  >
                    ${mes.monto}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Resumen y pagar */}
      {seleccionados.length > 0 && client?.estado === "Activo" && (
        <motion.div
          className="mt-8 bg-gradient-to-r from-green-100 to-green-200 border border-green-400 p-5 rounded-2xl shadow-lg flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-semibold text-green-700">
            Total a pagar:{" "}
            <span className="text-xl font-bold">${totalPagar}</span>
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="flex gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow disabled:opacity-50 items-center transition"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Wallet size={18} />
            )}
            {loading ? "Procesando..." : "Pagar Seleccionados"}
          </button>
        </motion.div>
      )}

      {/* AlertDialog para mensajes */}
      <AlertDialog open={!!alertMsg} onOpenChange={() => setAlertMsg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atención</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{alertMsg}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertMsg(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmación de pago */}
      <AlertDialog
        open={showConfirm}
        onOpenChange={() => setShowConfirm(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar pago</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            ¿Está seguro de pagar los meses seleccionados por un total de $
            {totalPagar}?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handlePay}>Sí, pagar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
