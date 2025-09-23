export interface Cliente {
  nombre: string;
  apellido: string;
  dui: string;
  estado: string;
}

export interface Pago {
  _id: string;
  mes: number;
  anio: number;
  monto: number;
  client: Cliente;
}
