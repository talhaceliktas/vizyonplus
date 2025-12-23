/**
 * Bu bileşen, kullanıcıların içerikleri Beğenme (Like) veya Beğenmeme (Dislike) işlemi yapmasını sağlar.
 * Toggle mantığıyla çalışır (örn. Liked durumdayken tekrar Like'a basılırsa like geri alınır).
 * Optimistic UI kullanarak anında geribildirim verir.
 */

"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { voteContent } from "../../actions/content-actions";

interface ContentVoteProps {
  contentId: number;
  currentStatus?: boolean | null; // true: Like, false: Dislike, null: Nötr
}

export default function ContentVote({
  contentId,
  currentStatus,
}: ContentVoteProps) {
  // Optimistic durum: Sunucu yanıtını beklemeden UI'ı güncellemek için
  const [optimisticStatus, setOptimisticStatus] = useState<boolean | null>(
    currentStatus ?? null,
  );
  const [loading, setLoading] = useState(false);

  const handleVote = async (newStatus: boolean) => {
    if (loading) return;

    const oldStatus = optimisticStatus;
    // Eğer aynı butona tekrar basılırsa (toggle), durumu nötr (null) yap
    const nextStatus = oldStatus === newStatus ? null : newStatus;

    setOptimisticStatus(nextStatus);
    setLoading(true);

    try {
      const res = await voteContent(contentId, nextStatus);

      if (!res.success) throw new Error(res.error);

      if (res.removed) {
        toast.success("Oylama geri alındı");
      } else {
        if (newStatus) toast.success("Beğendin 👍");
        else toast.success("Geri bildirim alındı 👎");
      }
    } catch {
      // Hata olursa eski duruma dön (Rollback)
      setOptimisticStatus(oldStatus);
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    // CONTAINER: Butonları saran kapsayıcı
    <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 p-1 transition-colors dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-md">
      {/* DISLIKE BUTONU */}
      <button
        onClick={() => handleVote(false)}
        disabled={loading}
        title="Beğenmedim"
        className={`group relative flex h-10 w-12 items-center justify-center rounded-l-full transition-all active:scale-95 ${
          optimisticStatus === false
            ? // AKTİF (Dislike Seçili)
              "bg-white text-red-500 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:text-red-500 dark:shadow-none dark:ring-0"
            : // PASİF
              "text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-sm dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white dark:hover:shadow-none"
        }`}
      >
        {loading && optimisticStatus === false ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsDown
            className={`h-5 w-5 transition-transform duration-300 ${
              optimisticStatus === false
                ? "scale-110 fill-current"
                : "group-hover:-rotate-12"
            }`}
          />
        )}
      </button>

      {/* AYIRAÇ (Divider) */}
      <div className="h-5 w-px bg-gray-300 dark:bg-white/10" />

      {/* LIKE BUTONU */}
      <button
        onClick={() => handleVote(true)}
        disabled={loading}
        title="Beğendim"
        className={`group relative flex h-10 w-12 items-center justify-center rounded-r-full transition-all active:scale-95 ${
          optimisticStatus === true
            ? // AKTİF (Like Seçili)
              "bg-white text-yellow-500 shadow-sm ring-1 ring-black/5 dark:bg-yellow-500/20 dark:text-yellow-500 dark:shadow-none dark:ring-0"
            : // PASİF
              "text-gray-400 hover:bg-white hover:text-yellow-500 hover:shadow-sm dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white dark:hover:shadow-none"
        }`}
      >
        {loading && optimisticStatus === true ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp
            className={`h-5 w-5 transition-transform duration-300 ${
              optimisticStatus === true
                ? "scale-110 fill-current"
                : "group-hover:rotate-12"
            }`}
          />
        )}
      </button>
    </div>
  );
}
