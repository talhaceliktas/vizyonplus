"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { SubscriptionStats } from "../../services/statsService";

const COLORS = ["#d946ef", "#06b6d4", "#22c55e", "#eab308"];

export default function SubscriptionCharts({
  stats,
}: {
  stats: SubscriptionStats;
}) {
  const renewalData = [
    { name: "Otomatik Açık", value: stats.autoRenewalActiveCount },
    { name: "Otomatik Kapalı", value: stats.autoRenewalInactiveCount },
  ];

  const tooltipStyle = {
    backgroundColor: "var(--color-primary-800)",
    borderColor: "var(--color-primary-600)",
    color: "var(--color-primary-50)",
    borderRadius: "12px",
    padding: "10px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
  };

  return (
    <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
      {/* Pasta Grafik */}
      <div className="border-primary-700 bg-primary-800/40 flex flex-col rounded-2xl border p-6 shadow-sm backdrop-blur-sm">
        <h3 className="text-primary-50 border-primary-700/50 mb-6 border-b pb-2 text-lg font-semibold">
          Abonelik Dağılımı
        </h3>
        <div className="min-h-[300px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={renewalData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {renewalData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#e0e0e0" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: "24px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Çubuk Grafik */}
      <div className="border-primary-700 bg-primary-800/40 flex flex-col rounded-2xl border p-6 shadow-sm backdrop-blur-sm">
        <h3 className="text-primary-50 border-primary-700/50 mb-6 border-b pb-2 text-lg font-semibold">
          Paket Tercihleri
        </h3>
        <div className="min-h-[300px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.packageDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-primary-700)"
                vertical={false}
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                stroke="var(--color-primary-400)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="var(--color-primary-400)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--color-primary-700)", opacity: 0.3 }}
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#e0e0e0" }}
              />
              <Bar
                dataKey="value"
                fill="var(--color-secondary-1)"
                radius={[6, 6, 0, 0]}
                barSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
