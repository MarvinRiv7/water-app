export interface Cliente {
  nombre: string;
  apellido: string;
  dui: string;
  estado: string;
}

export interface Clientee extends Cliente {
  _id: string;
  estado: "Activo" | "Desconectado" | "Exonerado"; // refinamos el tipo
}


export interface Pago {
  _id: string;
  mes: number;
  anio: number;
  monto: number;
  client: Cliente;
}

