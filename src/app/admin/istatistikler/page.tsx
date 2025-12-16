import { Suspense } from "react";
import {
  fetchSubscriptionStats,
  fetchTopRatedContent,
  fetchEngagementStats,
  fetchTopInteractions,
} from "@/features/admin/services/statsService";
import SubscriptionCharts from "@/features/admin/components/dashboard/SubscriptionCharts";
import TopRatedTable from "@/features/admin/components/dashboard/TopRatedTable";
import InteractionTable from "@/features/admin/components/dashboard/InteractionTable";
import StatCard from "@/features/admin/components/dashboard/StatCard"; // Yolu kontrol et
import {
  Users,
  Heart,
  Bookmark,
  ThumbsUp,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";

function StatsLoading() {
  return (
    <div className="bg-primary-800/30 text-primary-400 border-primary-800/50 flex h-96 w-full animate-pulse items-center justify-center rounded-2xl border">
      Veriler yükleniyor...
    </div>
  );
}

export default async function StatsPage() {
  const [
    subStats,
    topRated,
    engagementStats,
    topFavorites,
    topWatchLater,
    topLikes,
  ] = await Promise.all([
    fetchSubscriptionStats(),
    fetchTopRatedContent(5),
    fetchEngagementStats(),
    fetchTopInteractions("favoriler", 5),
    fetchTopInteractions("daha_sonra_izle", 5),
    fetchTopInteractions("begeniler", 5),
  ]);

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-[1600px] space-y-16">
        {/* --- BAŞLIK ALANI --- */}
        <div className="flex flex-col gap-3 pb-2">
          <h1 className="text-primary-50 text-3xl font-bold tracking-tight md:text-4xl">
            Yönetim Paneli
          </h1>
          <p className="text-primary-400 max-w-2xl text-lg">
            Platform performansının anlık takibi, kullanıcı etkileşimleri ve
            içerik analizleri.
          </p>
        </div>

        {/* --- BÖLÜM 1: KPI KARTLARI --- */}
        <section className="space-y-6">
          <div className="text-primary-100 border-primary-800 flex items-center gap-2.5 border-b pb-4">
            <Activity className="text-secondary-1 h-5 w-5" />
            <h2 className="text-xl font-semibold tracking-wide">Genel Bakış</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Aktif Abone"
              value={subStats.totalActiveSubscribers}
              icon={<Users size={26} />}
              colorClass="text-secondary-1 bg-secondary-1/10 ring-secondary-1/20"
            />
            <StatCard
              title="Favorilenenler"
              value={engagementStats.totalFavorites}
              icon={<Heart size={26} />}
              colorClass="text-red-400 bg-red-400/10 ring-red-400/20"
            />
            <StatCard
              title="İzleme Listesi"
              value={engagementStats.totalWatchLater}
              icon={<Bookmark size={26} />}
              colorClass="text-blue-400 bg-blue-400/10 ring-blue-400/20"
            />
            <StatCard
              title="Toplam Beğeni"
              value={engagementStats.totalLikes}
              icon={<ThumbsUp size={26} />}
              colorClass="text-green-400 bg-green-400/10 ring-green-400/20"
            />
          </div>
        </section>

        {/* --- BÖLÜM 2: ANALİZ VE SIRALAMA --- */}
        <section className="space-y-6">
          <div className="text-primary-100 border-primary-800 flex items-center gap-2.5 border-b pb-4">
            <TrendingUp className="text-secondary-2 h-5 w-5" />
            <h2 className="text-xl font-semibold tracking-wide">
              Performans Analizi
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {/* Grafikler (2 birim yer kaplar) */}
            <div className="xl:col-span-2">
              <Suspense fallback={<StatsLoading />}>
                <SubscriptionCharts stats={subStats} />
              </Suspense>
            </div>
          </div>
        </section>

        {/* --- BÖLÜM 3: ETKİLEŞİM LİDERLERİ --- */}
        <section className="space-y-6">
          <div className="text-primary-100 border-primary-800 flex items-center gap-2.5 border-b pb-4">
            <BarChart3 className="text-secondary-3 h-5 w-5" />
            <h2 className="text-xl font-semibold tracking-wide">
              Etkileşim Liderleri
            </h2>
          </div>
          <div className="h-full min-h-[400px]">
            <TopRatedTable data={topRated} />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <InteractionTable
              title="En Çok Favorilenenler"
              data={topFavorites}
              type="favorite"
            />
            <InteractionTable
              title="İzleme Listesi Popülerleri"
              data={topWatchLater}
              type="watch_later"
            />
            <InteractionTable
              title="En Çok Beğenilenler"
              data={topLikes}
              type="like"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
