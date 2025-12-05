"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";
import {
  checkFavorite,
  updateFavorite,
} from "@/lib/supabase/data-service-client"; // Import yolunu kontrol et

interface Props {
  contentId: number;
  initialState?: boolean;
}

export default function AddToFavoritesButton({
  contentId,
  initialState,
}: Props) {
  const [loading, setLoading] = useState(initialState === undefined);
  const [isFavorite, setIsFavorite] = useState(initialState ?? false);

  useEffect(() => {
    if (initialState !== undefined) return;

    let mounted = true;
    checkFavorite(contentId).then((val) => {
      if (mounted) {
        setIsFavorite(val);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [contentId, initialState]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    const yeniDurum = !isFavorite;
    setIsFavorite(yeniDurum);

    yeniDurum
      ? toast.success("Favorilere eklendi")
      : toast.success("Favorilerden çıkarıldı");

    try {
      await updateFavorite(contentId, yeniDurum);
    } catch (err) {
      setIsFavorite(!yeniDurum);
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-95 sm:h-12 sm:w-12 ${
        isFavorite
          ? // AKTİF DURUM (Kırmızı)
            "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/40 hover:scale-105 hover:bg-red-600"
          : // PASİF DURUM (Light: Gri / Dark: Cam Efekti)
            "border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500 dark:border-white/20 dark:bg-black/40 dark:text-gray-300 dark:backdrop-blur-md dark:hover:bg-white/10 dark:hover:text-white"
      }`}
    >
      {loading ? (
        <ImSpinner8 className="animate-spin" />
      ) : isFavorite ? (
        <FaHeart className="text-lg sm:text-xl" />
      ) : (
        <FaRegHeart className="text-lg sm:text-xl" />
      )}
    </button>
  );
}
