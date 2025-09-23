import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function ClientsSearch({ value, onChange }: Props) {
  return (
    <div className="mb-6 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200 w-full sm:w-96">
      <Search size={18} className="text-blue-500" />
      <Input
        type="text"
        placeholder="Buscar por nombre, apellido o DUI..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-0 focus-visible:ring-0"
      />
    </div>
  );
}
