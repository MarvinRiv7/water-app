export interface MontoDetalle {
  base: number;
  mora: number;
  total: number;
}

// 🔹 Calcular monto según tipo de pago y aplicar mora si corresponde
export const calcularMonto = (
  anio: number,
  mes: number,
  pagoTipo: "maximo" | "medio" | "minimo",
  mesReferenciaMora?: number,
  anioReferenciaMora?: number
): MontoDetalle => {
  let base = 7;
  const mora = 1;

  if (pagoTipo === "medio") {
    base = 5;
  } else if (pagoTipo === "minimo") {
    base = 3.5;
  }

  const aplicarMora =
    mesReferenciaMora &&
    anioReferenciaMora &&
    (anio > anioReferenciaMora ||
      (anio === anioReferenciaMora && mes >= mesReferenciaMora));

  return {
    base,
    mora: aplicarMora ? mora : 0,
    total: aplicarMora ? base + mora : base,
  };
};
