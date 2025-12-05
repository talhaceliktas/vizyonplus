import { Loader2 } from "lucide-react";

interface Props {
  hasNavigation?: boolean; // Alt bar (önceki/sonraki bölüm) var mı?
}

export default function WatchLoadingSkeleton({ hasNavigation = false }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white lg:flex-row lg:overflow-hidden">
      {/* SOL: PLAYER SKELETON */}
      <div className="flex w-full flex-col justify-center bg-black lg:h-screen lg:flex-1 lg:p-0">
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          {/* Yükleniyor İkonu */}
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
            <span className="animate-pulse text-sm font-medium text-gray-400">
              Yükleniyor...
            </span>
          </div>

          {/* ALT NAVİGASYON (Sadece Diziler İçin) */}
          {hasNavigation && (
            <div className="absolute right-0 bottom-0 left-0 flex h-16 items-center justify-between border-t border-white/10 bg-neutral-950 px-6">
              {/* Sol Buton Skeleton */}
              <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
              {/* Orta Buton Skeleton */}
              <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
              {/* Sağ Buton Skeleton */}
              <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
            </div>
          )}
        </div>
      </div>

      {/* SAĞ: SIDEBAR SKELETON */}
      <div className="w-full border-l border-white/10 bg-neutral-950 pt-20 lg:h-screen lg:w-[400px] lg:shrink-0 xl:w-[450px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-white/10" />
        </div>

        {/* Yorumlar */}
        <div className="mt-4 space-y-6 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-12 w-full animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
