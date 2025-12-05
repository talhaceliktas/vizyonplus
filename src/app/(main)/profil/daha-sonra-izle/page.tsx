import { Suspense } from "react";
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner";
import WatchList from "@/features/users/components/watchLater/WatchList";

export const metadata = {
  title: "Favorilerim | Vizyon+",
};

export default function FavoritesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WatchList />
    </Suspense>
  );
}
