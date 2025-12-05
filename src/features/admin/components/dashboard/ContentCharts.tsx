"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#d501f1", "#20dfd5"];

interface ContentChartsProps {
  data: {
    name: string;
    value: number;
  }[];
}

export default function ContentCharts({ data }: ContentChartsProps) {
  const safeData = data || [];

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
      {/* Başlık ve Toplam Sayı */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">İçerik Dağılımı</h3>
        <span className="rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-400">
          Toplam: {safeData.reduce((acc, curr) => acc + curr.value, 0)}
        </span>
      </div>

      {/* Grafik Alanı */}
      <div className="h-[300px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
              cornerRadius={6}
              stroke="none"
            >
              {safeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="stroke-neutral-900 stroke-2"
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(23, 23, 23, 0.95)",
                borderColor: "#404040",
                color: "#fff",
                borderRadius: "12px",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#fff", fontWeight: 500 }}
              cursor={{ fill: "transparent" }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="ml-1 font-medium text-neutral-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
