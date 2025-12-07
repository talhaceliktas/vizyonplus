import { CreditCard } from "lucide-react";
import Skeleton from "@shared/components/ui/Skeleton";

export default function SubscriptionPageSkeleton() {
  return (
    <div className="w-full flex-1 animate-pulse">
      {/* --- BAŞLIK ALANI SKELETON --- */}
      <div className="border-primary-800 mb-8 flex items-center gap-4 border-b pb-6">
        {/* İkon Kutusu */}
        <div className="bg-primary-900 border-primary-700 flex h-12 w-12 items-center justify-center rounded-full border">
          <CreditCard className="text-primary-800 h-5 w-5" />
        </div>
        <div className="space-y-2">
          {/* Başlık */}
          <Skeleton className="h-8 w-48 rounded-md" />
          {/* Açıklama */}
          <Skeleton className="h-4 w-64 rounded" />
        </div>
      </div>

      {/* --- İÇERİK ALANI SKELETON --- */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* SOL: PAKET KARTI SKELETON */}
        <div className="bg-primary-900/30 border-primary-800 flex-1 overflow-hidden rounded-2xl border">
          {/* Kart Header */}
          <div className="border-primary-800 flex items-center justify-between border-b p-6 md:p-8">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded" /> {/* Label */}
              <Skeleton className="h-8 w-40 rounded" /> {/* Plan Adı */}
            </div>
            <Skeleton className="h-8 w-24 rounded-full" /> {/* Rozet */}
          </div>

          {/* Kart Body */}
          <div className="p-6 md:p-8">
            {/* Fiyat */}
            <div className="mb-8 flex items-baseline gap-2">
              <Skeleton className="h-10 w-32 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>

            {/* Tarih Grid */}
            <div className="bg-primary-900 mb-8 grid gap-4 rounded-xl p-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" /> {/* İkon */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-2 w-16 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Özellikler Grid */}
            <div className="space-y-3">
              <Skeleton className="h-3 w-32 rounded" /> {/* Başlık */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-full max-w-[120px] rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: AKSİYONLAR SKELETON */}
        <div className="flex w-full flex-col gap-6 lg:w-80">
          {/* Kutu 1 (Yükseltme) */}
          <div className="bg-primary-900/30 border-primary-800 rounded-xl border p-6">
            <Skeleton className="mb-2 h-5 w-32 rounded" />
            <Skeleton className="mb-6 h-3 w-full rounded opacity-70" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Kutu 2 (İptal) */}
          <div className="bg-primary-900/30 border-primary-800 rounded-xl border p-6">
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-32 rounded" />
            </div>
            <Skeleton className="mb-6 h-3 w-full rounded opacity-70" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
