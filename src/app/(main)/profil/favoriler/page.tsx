import { Suspense } from "react";
import FavoritesList from "@/features/users/components/favorites/FavoritesList";
import SavedContentCardsSkeleton from "@/features/users/components/skeleton/SavedContentCardsSkeleton";

export const metadata = {
  title: "Favorilerim | Vizyon+",
};

export default function FavoritesPage() {
  return (
    <Suspense fallback={<SavedContentCardsSkeleton />}>
      <FavoritesList />
    </Suspense>
  );
}
