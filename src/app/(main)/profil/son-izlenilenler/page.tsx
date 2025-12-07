import Link from "next/link";
import { FaHistory, FaPlay } from "react-icons/fa";
import { getWatchHistory } from "@/features/users/services/userService";
import WatchHistoryCard from "@/features/users/components/profile/WatchHistoryCard";

export default async function WatchHistoryPage() {
  const watchHistory = await getWatchHistory();

  return (
    <div className="w-full flex-1">
      {/* BAŞLIK ALANI */}
      <div className="border-primary-800 mb-8 flex items-center gap-4 border-b pb-6">
        <div className="bg-primary-900 text-secondary-1 border-primary-700 flex h-12 w-12 items-center justify-center rounded-full border">
          <FaHistory className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-primary-50 text-2xl font-bold md:text-3xl">
            Son İzlenenler
          </h1>
          <p className="text-primary-400 text-sm md:text-base">
            Yarım bıraktığın veya bitirdiğin{" "}
            <span className="text-secondary-1 font-bold">
              {watchHistory.length}
            </span>{" "}
            içerik listeleniyor.
          </p>
        </div>
      </div>

      {/* LİSTE */}
      {watchHistory.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {watchHistory.map((item) => (
            <WatchHistoryCard key={item.historyId} item={item} />
          ))}
        </div>
      ) : (
        // --- BOŞ DURUM ---
        <div className="border-primary-800 bg-primary-900/50 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center">
          <div className="relative">
            <div className="bg-secondary-1/10 absolute inset-0 animate-pulse rounded-full blur-xl"></div>
            <FaPlay className="text-primary-600 relative h-12 w-12" />
          </div>

          <div>
            <h3 className="text-primary-100 text-xl font-bold">
              Henüz izleme geçmişin yok.
            </h3>
            <p className="text-primary-500 mx-auto mt-2 max-w-xs text-sm">
              İzlediğin içerikler kaldığın yerden devam edebilmen için burada
              görünür.
            </p>
          </div>

          <Link
            href="/icerikler"
            className="bg-primary-50 text-primary-950 hover:bg-secondary-1 mt-4 rounded-full px-8 py-3 text-sm font-bold transition hover:shadow-lg active:scale-95"
          >
            Hemen Bir Şeyler İzle
          </Link>
        </div>
      )}
    </div>
  );
}
