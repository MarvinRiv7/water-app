import { Link } from "react-router-dom";
import { Users, PlusCircle, CreditCard } from "lucide-react";

export default function DashboardCards() {
  const cards = [
    { to: "/clients/add", icon: PlusCircle, label: "Agregar Cliente" },
    { to: "/clients", icon: Users, label: "Ver / Editar Clientes" },
    { to: "/payments", icon: CreditCard, label: "Pagos" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-105 flex flex-col items-center justify-center border border-gray-100"
        >
          <c.icon className="w-8 h-8 text-blue-600 mb-2" />
          <span className="font-semibold text-gray-800">{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
