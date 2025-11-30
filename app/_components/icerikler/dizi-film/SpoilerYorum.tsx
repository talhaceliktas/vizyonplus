"use client";

import Image from "next/image";
import { YorumTipi } from "../../../types";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { IoEyeOffOutline } from "react-icons/io5";

const DEFAULT_AVATAR_API =
  "https://ui-avatars.com/api/?background=random&color=fff&name=";

type SpoilerYorumProps = {
  yorum: YorumTipi;
  variant?: "default" | "compact";
};

const SpoilerYorum = ({ yorum, variant = "default" }: SpoilerYorumProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const isCompact = variant === "compact";

  const zaman = formatDistanceToNow(new Date(yorum.olusturulma_zamani), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <div
      className={`animate-in fade-in flex duration-300 ${isCompact ? "gap-2 py-1" : "gap-4 py-4"}`}
    >
      {/* --- AVATAR --- */}
      <div className="shrink-0 pt-1">
        <div
          className={`relative overflow-hidden rounded-full border border-red-500/30 opacity-70 grayscale ${isCompact ? "h-8 w-8" : "h-12 w-12 sm:h-14 sm:w-14"}`}
        >
          <Image
            alt={`${yorum.profiller.isim} avatar`}
            src={
              yorum.profiller.profil_fotografi ||
              `${DEFAULT_AVATAR_API}${yorum.profiller.isim}`
            }
            className="object-cover"
            fill
            sizes={isCompact ? "32px" : "56px"}
          />
        </div>
      </div>

      <div className="flex w-full max-w-full min-w-0 flex-col">
        {/* --- BAŞLIK --- */}
        <div className="flex flex-wrap items-baseline gap-2">
          <span
            className={`font-bold text-gray-400 ${isCompact ? "text-xs" : "text-base sm:text-lg"}`}
          >
            {yorum.profiller.isim}
          </span>
          {/* Spoiler Rozeti */}
          <span
            className={`rounded border border-red-500/20 bg-red-500/10 font-bold tracking-wider text-red-500 uppercase ${isCompact ? "px-1 text-[9px]" : "px-2 py-0.5 text-[10px] sm:text-xs"}`}
          >
            Spoiler
          </span>
          <span
            className={`text-gray-600 ${isCompact ? "text-[10px]" : "text-xs sm:text-sm"}`}
          >
            {zaman}
          </span>
        </div>

        {/* --- GİZLİ İÇERİK ALANI --- */}
        <div
          className={`relative mt-1 cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-white/5 transition-all hover:bg-white/10 ${isCompact ? "p-2" : "p-3 sm:p-4"}`}
          onClick={() => setIsRevealed(true)}
        >
          <p
            className={`leading-relaxed break-words text-gray-300 transition-all duration-500 ${
              isRevealed
                ? "blur-0 select-text"
                : "opacity-50 blur-sm select-none"
            } ${isCompact ? "text-xs" : "text-sm sm:text-base"}`}
          >
            {yorum.yorum}
          </p>

          {!isRevealed && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
              <div
                className={`flex items-center gap-2 rounded-full border border-white/10 bg-black/80 font-bold text-white shadow-xl transition-transform hover:scale-105 ${isCompact ? "px-2 py-1 text-[10px]" : "px-4 py-1.5 text-xs"}`}
              >
                <IoEyeOffOutline className="text-red-400" />
                <span>Göster</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpoilerYorum;
