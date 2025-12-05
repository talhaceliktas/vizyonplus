import Skeleton from "@shared/components/ui/Skeleton";

export default function SavedContentCardsSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* --- HEADER SKELETON --- */}
      <div className="border-primary-800 mb-6 flex items-center gap-3 border-b pb-4">
        {/* Başlık: "Favorilerim" */}
        <Skeleton className="h-8 w-40 rounded-lg" />

        {/* Badge: İçerik Sayısı */}
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* --- GRID LIST SKELETON --- */}
      {/* Orijinalindeki grid yapısının aynısı: grid-cols-1 md:grid-cols-2 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 6 adet sahte kart oluşturuyoruz ki ekran dolsun */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border-primary-800 bg-primary-900/50 flex gap-4 rounded-xl border p-4"
          >
            {/* 1. Poster Alanı (Solda) */}
            <Skeleton className="h-32 w-24 shrink-0 rounded-lg" />

            {/* 2. Bilgi Alanı (Sağda) */}
            <div className="flex flex-1 flex-col justify-center gap-3">
              {/* Film İsmi */}
              <Skeleton className="h-6 w-3/4 rounded-md" />

              {/* Meta Bilgileri (Yıl, Tür vs.) */}
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>

              {/* Aksiyon Butonu veya Açıklama simülasyonu */}
              <div className="mt-auto flex justify-end pt-2">
                <Skeleton className="h-8 w-8 rounded-full" />{" "}
                {/* Kalp ikonu yeri */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
