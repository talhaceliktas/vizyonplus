"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";
import {
  checkFavorite,
  updateFavorite,
} from "@lib/supabase/data-service-client";

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
      className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 sm:h-12 sm:w-12 ${
        isFavorite
          ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/50"
          : "border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-white/10"
      }`}
    >
      {loading ? (
        <ImSpinner8 className="animate-spin" />
      ) : isFavorite ? (
        <FaHeart className="text-xl" />
      ) : (
        <FaRegHeart className="text-xl" />
      )}
    </button>
  );
}
