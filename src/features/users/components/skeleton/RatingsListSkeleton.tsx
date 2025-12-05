import Skeleton from "@shared/components/ui/Skeleton";

export default function RatingsListSkeleton() {
  return (
    <div className="w-full">
      {/* --- HEADER SKELETON --- */}
      <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        {/* Başlık: "Puanlamalarım" */}
        <Skeleton className="h-8 w-48 rounded-lg" />
        {/* Badge: Sayı */}
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* --- GRID LIST SKELETON --- */}
      <div className="grid grid-cols-1 gap-6">
        {/* 4 adet örnek kart oluşturuyoruz */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            // Card Wrapper: Orijinal RatedContentCard yapısının aynısı (padding, flex, border vb.)
            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 sm:flex-row sm:items-start"
          >
            {/* 1. POSTER ALANI (SOL) */}
            {/* Mobile: w-full, Desktop: w-32 */}
            <Skeleton className="aspect-2/3 w-full shrink-0 rounded-xl sm:w-32" />

            {/* 2. BİLGİ ALANI (ORTA) */}
            <div className="flex flex-1 flex-col gap-3">
              {/* Film Başlığı */}
              <Skeleton className="h-7 w-3/4 rounded-md" />

              {/* Meta (Yıl, Tür) */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>

              {/* Açıklama Satırları */}
              <div className="space-y-2 py-1">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>

              {/* Footer: Tarih */}
              <div className="mt-auto pt-1">
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            </div>

            {/* 3. PUANLAMA KUTUSU ALANI (SAĞ) */}
            {/* Orijinalindeki ContentRate kutusunu simüle ediyoruz */}
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <Skeleton className="h-[140px] w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
