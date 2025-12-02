"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { icerikOyla } from "../../_lib/data-service-server";

type IcerikOylaProps = {
  icerikId: number;
  mevcutDurum?: boolean | null; // true: Like, false: Dislike, null: Yok
};

export default function IcerikOyla({ icerikId, mevcutDurum }: IcerikOylaProps) {
  // State başlangıç değerini proptan alıyor
  const [optimisticDurum, setOptimisticDurum] = useState<boolean | null>(
    mevcutDurum ?? null,
  );
  const [loading, setLoading] = useState(false);

  const handleVote = async (yeniDurum: boolean) => {
    if (loading) return;

    const eskiDurum = optimisticDurum;
    // Tıklanan zaten seçiliyse kaldır (null), değilse yeni durumu ata
    const nextState = eskiDurum === yeniDurum ? null : yeniDurum;

    setOptimisticDurum(nextState);
    setLoading(true);

    try {
      // Not: Backend fonksiyonunun adı 'icerikOyla' olmalı (önceki adımda güncellemiştik)
      const res = await icerikOyla(icerikId, yeniDurum);

      if (!res.success) throw new Error(res.error);

      if (res.removed) {
        toast.success("Oylama geri alındı");
      } else {
        if (yeniDurum) toast.success("Beğendin 👍");
        else toast.success("Geri bildirim alındı 👎");
      }
    } catch {
      setOptimisticDurum(eskiDurum); // Hata varsa geri al
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md">
      {/* --- BEĞENMEDİM (Sol) --- */}
      <button
        onClick={() => handleVote(false)}
        disabled={loading}
        title="Beğenmedim"
        className={`group relative flex h-10 w-12 items-center justify-center rounded-l-full transition-all active:scale-95 ${
          optimisticDurum === false
            ? "bg-white/10 text-red-500" // Seçiliyse Kırmızı
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {loading && optimisticDurum === false ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsDown
            className={`h-5 w-5 transition-transform duration-300 ${
              optimisticDurum === false
                ? "scale-110 fill-current"
                : "group-hover:-rotate-12"
            }`}
          />
        )}
      </button>

      {/* Ayıraç Çizgisi */}
      <div className="h-5 w-px bg-white/10" />

      {/* --- BEĞENDİM (Sağ) --- */}
      <button
        onClick={() => handleVote(true)}
        disabled={loading}
        title="Beğendim"
        className={`group relative flex h-10 w-12 items-center justify-center rounded-r-full transition-all active:scale-95 ${
          optimisticDurum === true
            ? "bg-yellow-500/20 text-yellow-500" // Seçiliyse Sarı
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {loading && optimisticDurum === true ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp
            className={`h-5 w-5 transition-transform duration-300 ${
              optimisticDurum === true
                ? "scale-110 fill-current"
                : "group-hover:rotate-12"
            }`}
          />
        )}
      </button>
    </div>
  );
}
