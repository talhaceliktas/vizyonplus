"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GenreBarChartProps {
  data: { name: string; value: number }[];
}

export default function GenreBarChart({ data }: GenreBarChartProps) {
  // Eğer veri yoksa component patlamasın
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-500">
        Veri bulunamadı
      </div>
    );
  }

  return (
    <div className="flex h-[400px] w-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">En Popüler Türler</h3>
        <p className="text-xs text-neutral-400">
          Platformdaki içeriklerin kategorilere göre dağılımı (Top 10).
        </p>
      </div>

      <div className="min-h-0 w-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }} // Sağ tarafa biraz boşluk bıraktık (Tooltip taşmasın)
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#404040"
              opacity={0.3}
            />

            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#a3a3a3", fontSize: 12, fontWeight: 500 }}
              width={100}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                value.length > 12 ? `${value.substring(0, 12)}...` : value
              }
            />

            <XAxis type="number" hide />

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)", radius: 4 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="z-50 rounded-lg border border-neutral-700 bg-neutral-800 p-3 shadow-xl">
                      <p className="mb-1 text-sm font-bold text-white">
                        {payload[0].payload.name}
                      </p>
                      <p className="text-xs text-blue-400">
                        {payload[0].value} Adet İçerik
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              barSize={24}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  // İlk 3 popüler türü parlak kırmızı yapıyoruz
                  fill={index < 3 ? "#E50914" : "#8c161f"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
