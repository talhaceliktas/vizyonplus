import Link from "next/link";
import { Star, Film } from "lucide-react";
import { getUserRatings } from "@/features/users/services/userService";
import RatedContentCard from "./RatedContentCard";

export default async function RatingsList() {
  const ratings = await getUserRatings();

  if (!ratings || ratings.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-500/20 blur-xl"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-yellow-500/30 bg-white shadow-2xl dark:bg-gray-900">
            <Star className="fill-yellow-500 text-5xl text-yellow-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Henüz Puanlama Yapmadın
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
          İzlediğin içerikleri puanlayarak kütüphaneni kişiselleştir.
        </p>
        <Link
          href="/icerikler"
          className="group mt-8 flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3 font-bold text-white transition-all hover:bg-yellow-500 hover:text-white hover:shadow-lg active:scale-95 dark:bg-white dark:text-black dark:hover:bg-yellow-500"
        >
          <Film className="h-5 w-5" />
          <span>İçerikleri Keşfet</span>
        </Link>
      </div>
    );
  }

  // --- LİSTE DURUMU ---
  return (
    <div className="w-full">
      <div className="mb-8 flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-white/10">
        <h1 className="text-primary-50 text-2xl font-bold">Puanlamalarım</h1>
        <span className="rounded-full border border-yellow-600/30 bg-yellow-50 px-3 py-1 text-xs font-bold tracking-wide text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-500">
          {ratings.length} İçerik
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {ratings.map((item) => (
          <RatedContentCard
            key={item.ratingId}
            ratingId={item.ratingId}
            rating={item.rating}
            ratedAt={item.ratedAt}
            content={item.content as any}
          />
        ))}
      </div>
    </div>
  );
}
