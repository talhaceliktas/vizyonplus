/**
 * Bu sayfa, kullanıcının DAHA SONRA İZLE listesine eklediği içerikleri gösterir.
 * `WatchList` bileşeni üzerinden verileri getirir.
 */

import { Suspense } from "react";
import WatchList from "@/features/users/components/watchLater/WatchList";
import SavedContentCardsSkeleton from "@/features/users/components/skeleton/SavedContentCardsSkeleton";

export const metadata = {
  title: "İzleme Listem | Vizyon+",
};

export default function WatchListPage() {
  return (
    <Suspense fallback={<SavedContentCardsSkeleton />}>
      <WatchList />
    </Suspense>
  );
}
