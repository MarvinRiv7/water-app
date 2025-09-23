
export type Mes = {
  mes: number;
  anio: number;
  monto: number;
};


export type Client = {
  dui: string;
  estado: "Activo" | "Desconectado" | "Exonerado";
  ultimoMes: number;
  ultimoAnio: number;
};
