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
  return (
    // 1. overflow-hidden ve flex-col ekledik.
    // Böylece başlık ve grafik alt alta düzgün hizalanır, taşma engellenir.
    <div className="flex h-[400px] w-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">En Popüler Türler</h3>
        <p className="text-xs text-neutral-400">
          Platformdaki içeriklerin kategorilere göre dağılımı (Top 10).
        </p>
      </div>

      {/* 2. flex-1 ve min-w-0 EKLENDİ (SİHİRLİ KOD BURASI) */}
      {/* Bu div, kalan tüm yüksekliği kaplar ve genişliğin taşmasını engeller */}
      <div className="min-h-0 w-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            // Marginleri sıfırladık, YAxis width ile yöneteceğiz
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
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
              width={100} // İsimler için sabit genişlik
              axisLine={false}
              tickLine={false}
              // Uzun isim gelirse taşmasın diye "..." ekleyebiliriz (opsiyonel)
              tickFormatter={(value) =>
                value.length > 12 ? `${value.substring(0, 12)}...` : value
              }
            />

            <XAxis
              type="number"
              hide // X ekseni sayılarını gizleyerek daha temiz bir görüntü (Netflix style)
            />

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)", radius: 4 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="z-50 rounded-lg border border-neutral-700 bg-neutral-800 p-3 shadow-xl">
                      <p className="mb-1 text-sm font-bold text-white">
                        {payload[0].payload.name}
                      </p>
                      <p className="text-primary-400 text-xs">
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
              barSize={24} // Çubukları biraz kalınlaştırdım
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  // İlk 3'ü parlak kırmızı, diğerleri daha koyu/soluk
                  fill={
                    index < 3
                      ? "var(--color-secondary-1)"
                      : "var(--color-secondary-3)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
