import { FaHistory } from "react-icons/fa";
import Skeleton from "@shared/components/ui/Skeleton";

export default function WatchHistorySkeleton() {
  return (
    <div className="w-full flex-1 animate-pulse space-y-8">
      {/* --- BAŞLIK ALANI SKELETON --- */}
      <div className="border-primary-800 mb-8 flex items-center gap-4 border-b pb-6">
        {/* İkon Kutusu */}
        <div className="bg-primary-900 border-primary-800 flex h-12 w-12 items-center justify-center rounded-full border">
          <FaHistory className="text-primary-800 h-5 w-5" />
        </div>
        <div className="space-y-2">
          {/* Başlık */}
          <Skeleton className="h-8 w-48 rounded-md" />
          {/* Açıklama */}
          <Skeleton className="h-4 w-64 rounded" />
        </div>
      </div>

      {/* --- LİSTE GRID SKELETON --- */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-primary-900 border-primary-800 flex h-32 w-full gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm"
          >
            {/* Resim Alanı (Solda) */}
            <Skeleton className="aspect-video h-full w-auto shrink-0 rounded-lg" />

            {/* İçerik Alanı (Sağda) */}
            <div className="flex flex-1 flex-col justify-center gap-3 py-1">
              {/* Üst Satır: Başlık */}
              <Skeleton className="h-5 w-3/4 rounded" />

              {/* Orta Satır: Meta veri (Yıl, süre vb.) */}
              <Skeleton className="h-3 w-1/2 rounded opacity-70" />

              {/* Alt Satır: Progress Bar */}
              <div className="mt-1 space-y-1">
                <div className="flex justify-between">
                  <Skeleton className="h-2 w-10 rounded" />
                  <Skeleton className="h-2 w-10 rounded" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
