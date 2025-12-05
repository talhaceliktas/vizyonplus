"use client";

import { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";
import {
  checkWatchList,
  updateWatchList,
} from "@/lib/supabase/data-service-client"; // Import yolunu kontrol et

interface Props {
  contentId: number;
  initialState?: boolean;
}

export default function AddToWatchLaterButton({
  contentId,
  initialState,
}: Props) {
  const [loading, setLoading] = useState(initialState === undefined);
  const [isSaved, setIsSaved] = useState(initialState ?? false);

  useEffect(() => {
    if (initialState !== undefined) return;

    let mounted = true;
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

    yeniDurum
      ? toast.success("Listeye eklendi")
      : toast.success("Listeden çıkarıldı");

    try {
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
      className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-95 sm:h-12 sm:w-12 ${
        isSaved
          ? // AKTİF DURUM (Sarı)
            "border-yellow-500 bg-yellow-500 text-black shadow-lg shadow-yellow-500/40 hover:scale-105 hover:bg-yellow-400"
          : // PASİF DURUM (Light: Gri / Dark: Cam Efekti)
            "border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-yellow-500 dark:border-white/20 dark:bg-black/40 dark:text-gray-300 dark:backdrop-blur-md dark:hover:bg-white/10 dark:hover:text-white"
      }`}
    >
      {loading ? (
        <ImSpinner8 className="animate-spin" />
      ) : isSaved ? (
        <FaBookmark className="text-lg sm:text-xl" />
      ) : (
        <FaRegBookmark className="text-lg sm:text-xl" />
      )}
    </button>
  );
}
