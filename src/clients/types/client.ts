export interface Client {
  dui: string;
  nombre: string;
  apellido: string;
  ultimoMes: number;
  ultimoAnio: number;
  estado: "Activo" | "Exonerado" | "Desconectado";
}
