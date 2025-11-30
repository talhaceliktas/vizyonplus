"use client";

import Image from "next/image";
import { YorumTipi } from "../../../types";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

const DEFAULT_AVATAR_API =
  "https://ui-avatars.com/api/?background=random&color=fff&name=";

type YorumProps = {
  yorum: YorumTipi;
  variant?: "default" | "compact";
};

const Yorum = ({ yorum, variant = "default" }: YorumProps) => {
  const isCompact = variant === "compact";

  const zaman = formatDistanceToNow(new Date(yorum.olusturulma_zamani), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <div
      className={`group animate-in fade-in slide-in-from-bottom-2 flex duration-300 ${isCompact ? "gap-2 py-1" : "gap-4 py-4"}`}
    >
      {/* --- AVATAR --- */}
      <div className="shrink-0 pt-1">
        <div
          className={`relative overflow-hidden rounded-full border border-white/10 shadow-sm ${isCompact ? "h-8 w-8" : "h-12 w-12 sm:h-14 sm:w-14"}`}
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

      {/* --- İÇERİK --- */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-baseline gap-2">
          {/* İsim */}
          <span
            className={`cursor-pointer font-bold text-yellow-500 hover:underline ${isCompact ? "text-xs" : "text-base sm:text-lg"}`}
          >
            {yorum.profiller.isim}
          </span>
          {/* Tarih */}
          <span
            className={`text-gray-500 ${isCompact ? "text-[10px]" : "text-xs sm:text-sm"}`}
          >
            {zaman}
          </span>
        </div>

        {/* Yorum Metni */}
        <p
          className={`leading-relaxed break-words text-gray-300 ${isCompact ? "mt-0.5 text-xs" : "mt-1 text-sm sm:text-base"}`}
        >
          {yorum.yorum}
        </p>
      </div>
    </div>
  );
};

export default Yorum;
