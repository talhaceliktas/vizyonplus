import { Suspense } from "react";
import LoadingSpinner from "@shared/components/ui/LoadingSpinner";
import RatingsList from "@/features/users/components/ratings/RatingsList";

export default function RatingsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<LoadingSpinner />}>
        <RatingsList />
      </Suspense>
    </div>
  );
}
