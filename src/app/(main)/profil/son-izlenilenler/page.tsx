/**
 * Bu sayfa, kullanıcının İZLEME GEÇMİŞİNİ (Watch History) listeler.
 * Kaldığı yerden devam etmesi için ilerleme durumlarını gösterir.
 */

import { Suspense } from "react";
import WatchHistoryList from "@/features/users/components/profile/WatchHistoryList";
import WatchHistorySkeleton from "@/features/users/components/profile/WatchHistorySkeleton";

export default function WatchHistoryPage() {
  return (
    <Suspense fallback={<WatchHistorySkeleton />}>
      <WatchHistoryList />
    </Suspense>
  );
}
