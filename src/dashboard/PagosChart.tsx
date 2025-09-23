import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface Stats {
  alDia: number;
  atrasados: number;
}

interface Props {
  stats: Stats;
}

export default function PagosChart({ stats }: Props) {
  const data = [
    { name: "Al día", value: stats.alDia },
    { name: "Atrasados", value: stats.atrasados },
  ];
  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <PieChartIcon className="w-5 h-5 text-blue-600" />
          Estado de Pagos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                innerRadius={50}
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ marginTop: "12px" }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-gray-700 font-medium">Total</span>
            <p className="text-2xl font-extrabold text-gray-800">{stats.alDia + stats.atrasados}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
