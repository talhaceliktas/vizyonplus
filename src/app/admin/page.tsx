import { getDashboardStats } from "@admin/services/dashboardService";
import StatsGrid from "@admin/components/dashboard/StatsGrid";
import ContentCharts from "@admin/components/dashboard/ContentCharts";
import GenreBarChart from "@admin/components/dashboard/GenreBarChart";
import RecentActivity from "@admin/components/dashboard/RecentActivity";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getDashboardStats();

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-700">
      <div>
        <h2 className="text-3xl font-bold text-white">Genel Bakış</h2>
        <p className="text-neutral-400">
          Vizyon+ platformunun anlık istatistikleri.
        </p>
      </div>

      <StatsGrid counts={data.counts} />

      {/* Grafikler Alanı */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="min-w-0">
          <GenreBarChart data={data.genreChartData} />
        </div>

        <div className="min-w-0">
          <ContentCharts data={data.typeChartData} />
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="grid grid-cols-1">
        <RecentActivity
          users={data.sonKullanicilar}
          comments={data.sonYorumlar}
        />
      </div>
    </div>
  );
}
