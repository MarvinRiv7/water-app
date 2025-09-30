import { useEffect, useState } from "react";

import DashboardHeader from "./DashboardHeader";
import PagosChart from "./PagosChart";
import DashboardCards from "./DashboardCards";
import YearSelector from "./YearSelector";
import PagosPorAnio from "@/payments/components/PagosPorAnio";
import api from "@/services/api";

interface Stats {
  alDia: number;
  atrasados: number;
}

export default function Dashboard() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<Stats>({ alDia: 0, atrasados: 0 });

  useEffect(() => {
    const fetchStats = () =>
      api.get("/clients/stats").then((res) => setStats(res.data));
    fetchStats();
    window.addEventListener("statsUpdated", fetchStats);
    return () => window.removeEventListener("statsUpdated", fetchStats);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <DashboardHeader />
      <PagosChart stats={stats} />
      <DashboardCards />
      <YearSelector anio={anio} setAnio={setAnio} />
      <PagosPorAnio anio={anio} />
    </div>
  );
}
