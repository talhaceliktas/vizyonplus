/**
 * Bu sayfa, kullanıcının FAVORİLERE eklediği içerikleri listeler.
 * Veriyi `FavoritesList` bileşeni üzerinden çeker.
 * Yüklenme sırasında `SavedContentCardsSkeleton` ile placeholder gösterir.
 */

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
