import dayjs from "dayjs";

// 🔹 Calcular monto considerando mora solo si hay 3 meses completos de retraso (sin contar el mes actual)
export const calcularMonto = (
  anio: number,
  mes: number,
  ultimoPago: dayjs.Dayjs,
  hoy: dayjs.Dayjs
) => {
  const fechaMes = dayjs(`${anio}-${mes.toString().padStart(2, "0")}-01`).endOf("month");

  // Restamos 1 para no contar el mes actual
  const mesesRetraso = hoy.diff(ultimoPago, "month") - 1;

  if (fechaMes.isBefore(hoy) && mesesRetraso >= 3) return 8;
  return 7;
};
