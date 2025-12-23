/**
 * Bu sayfa, kullanıcının içeriklere verdiği PUANLARI listeler.
 * `RatingsList` bileşeni kullanıcıya özel puanları çeker.
 */

import { Suspense } from "react";
import RatingsList from "@/features/users/components/ratings/RatingsList";
import RatingsListSkeleton from "@/features/users/components/skeleton/RatingsListSkeleton";

export default function RatingsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<RatingsListSkeleton />}>
        <RatingsList />
      </Suspense>
    </div>
  );
}
