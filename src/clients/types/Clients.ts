export interface Client {
  _id?: string;
  dui: string;
  nombre: string;
  apellido: string;
  ultimoMes: number;
  ultimoAnio: number;
  lastPayment: { mes: number; anio: number };
  estado: "Activo" | "Desconectado" | "Exonerado";
}
