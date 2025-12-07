import { Suspense } from "react";
import WatchHistoryList from "@/features/users/components/profile/WatchHistoryList"; // Dosya yolunu kendine göre ayarla
import WatchHistorySkeleton from "@/features/users/components/profile/WatchHistorySkeleton"; // Dosya yolunu kendine göre ayarla

export default function WatchHistoryPage() {
  return (
    <Suspense fallback={<WatchHistorySkeleton />}>
      <WatchHistoryList />
    </Suspense>
  );
}
