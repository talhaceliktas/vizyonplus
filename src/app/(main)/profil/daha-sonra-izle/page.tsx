import { Suspense } from "react";
import WatchList from "@/features/users/components/watchLater/WatchList";
import SavedContentCardsSkeleton from "@/features/users/components/skeleton/SavedContentCardsSkeleton";

export const metadata = {
  title: "Favorilerim | Vizyon+",
};

export default function FavoritesPage() {
  return (
    <Suspense fallback={<SavedContentCardsSkeleton />}>
      <WatchList />
    </Suspense>
  );
}
