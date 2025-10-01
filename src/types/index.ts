
export type Mes = {
  mes: number;
  anio: number;
  monto: number;
  mora: number
  base: number
};


export type Client = {
  nombre: string
  apellido: string
  dui: string;
  estado: "Activo" | "Desconectado" | "Exonerado";
  ultimoMes: number;
  ultimoAnio: number;
};
