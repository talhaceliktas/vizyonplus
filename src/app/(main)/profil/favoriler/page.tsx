import { Suspense } from "react";
import FavoritesList from "@/features/users/components/favorites/FavoritesList";
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner";

export const metadata = {
  title: "Favorilerim | Vizyon+",
};

export default function FavoritesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FavoritesList />
    </Suspense>
  );
}
