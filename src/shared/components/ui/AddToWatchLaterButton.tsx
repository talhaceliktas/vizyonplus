"use client";

import { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";
import {
  checkWatchList,
  updateWatchList,
} from "@lib/supabase/data-service-client";

interface Props {
  contentId: number;
  initialState?: boolean;
}

export default function AddToWatchLaterButton({
  contentId,
  initialState,
}: Props) {
  const [loading, setLoading] = useState(initialState === undefined);
  // isFavorite -> isSaved olarak değiştirdik (daha genel)
  const [isSaved, setIsSaved] = useState(initialState ?? false);

  useEffect(() => {
    if (initialState !== undefined) return;

    let mounted = true;
    // Yeni servis fonksiyonunu çağırıyoruz
    checkWatchList(contentId).then((val) => {
      if (mounted) {
        setIsSaved(val);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [contentId, initialState]);

  const toggleWatchLater = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    const yeniDurum = !isSaved;
    setIsSaved(yeniDurum);

    // Mesajları güncelledik
    yeniDurum
      ? toast.success("Listeye eklendi")
      : toast.success("Listeden çıkarıldı");

    try {
      // Yeni işlem fonksiyonunu çağırıyoruz
      await updateWatchList(contentId, yeniDurum);
    } catch (err) {
      setIsSaved(!yeniDurum);
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <button
      onClick={toggleWatchLater}
      disabled={loading}
      title={isSaved ? "Listeden Çıkar" : "Daha Sonra İzle"}
      className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 sm:h-12 sm:w-12 ${
        isSaved
          ? "border-secondary-1 bg-secondary-1 text-black shadow-lg shadow-yellow-500/40" // Aktif: Sarı Zemin + Siyah Yazı
          : "border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-white/10" // Pasif: Glass Effect
      }`}
    >
      {loading ? (
        <ImSpinner8 className="animate-spin" />
      ) : isSaved ? (
        <FaBookmark className="text-xl" />
      ) : (
        <FaRegBookmark className="text-xl" />
      )}
    </button>
  );
}
