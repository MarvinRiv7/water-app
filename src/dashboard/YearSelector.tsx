interface Props {
  anio: number;
  setAnio: (anio: number) => void;
}

export default function YearSelector({ anio, setAnio }: Props) {
  return (
    <div className="flex items-center gap-4 mt-10">
      <label className="font-semibold">Seleccionar año:</label>
      <input
        type="number"
        value={anio}
        onChange={(e) => setAnio(Number(e.target.value))}
        className="border rounded-lg px-3 py-2 w-32"
      />
    </div>
  );
}
