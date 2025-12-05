"use client";

import { useState } from "react";
import { Star, Users } from "lucide-react";
import toast from "react-hot-toast";
import { rateContent } from "../../actions/content-actions";

interface ContentRateProps {
  contentId: number;
  userRating: number | null;
  averageRating?: {
    average: number;
    count: number;
  };
}

export default function ContentRate({
  contentId,
  userRating,
  averageRating,
}: ContentRateProps) {
  const [hoverRating, setHoverRating] = useState(0);
  // Başlangıç değerimiz
  const [selectedRating, setSelectedRating] = useState(userRating || 0);

  const handleRate = async (rating: number) => {
    // 1. Snapshot: Mevcut değeri hafızaya al (Hata olursa buraya döneceğiz)
    const previousRating = selectedRating;

    // 2. Optimistic Update: UI'ı anında güncelle (Loading falan yok!)
    setSelectedRating(rating);

    // Küçük bir UX dokunuşu: Hover'ı sıfırla ki kullanıcı tıkladığını net görsün
    setHoverRating(0);

    try {
      // 3. İsteği arkadan gönder
      toast.success("Puanın kaydedildi", { id: "rate-success" });
      const res = await rateContent(contentId, rating);

      if (res.error) {
        throw new Error(res.error);
      }
    } catch (error: any) {
      setSelectedRating(previousRating);
      toast.error(error.message || "Puanlama başarısız oldu");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 transition-colors dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm dark:hover:bg-white/10">
      {/* GENEL ORTALAMA KISMI (Değişiklik yok) */}
      {averageRating && (
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-white/10">
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Vizyon+ Puanı
            </span>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-1.5">
                <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  {averageRating.average > 0
                    ? averageRating.average.toFixed(1)
                    : "-"}
                </span>
              </div>
              <span className="mb-1 text-sm font-medium text-gray-400 dark:text-gray-500">
                / 10
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center">
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {averageRating.count} Oy
              </span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-600">
              kullanıcı oyladı
            </span>
          </div>
        </div>
      )}

      {/* KULLANICI PUANLAMASI */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Senin Puanın:
          </span>
          <span
            className={`text-lg font-black transition-all duration-300 ${
              selectedRating > 0
                ? "scale-110 text-yellow-500"
                : "text-gray-400 dark:text-gray-600"
            }`}
          >
            {hoverRating || selectedRating || "-"}{" "}
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
              / 10
            </span>
          </span>
        </div>

        {/* YILDIZLAR */}
        <div
          className="flex items-center justify-between gap-1"
          onMouseLeave={() => setHoverRating(0)}
        >
          {[...Array(10)].map((_, i) => {
            const ratingValue = i + 1;
            // Mantık: Hover varsa onu göster, yoksa seçili olanı göster
            const isFilled = ratingValue <= (hoverRating || selectedRating);

            return (
              <button
                key={i}
                type="button"
                // disabled={loading} KALDIRDIK -> Kullanıcıyı engellemek yok
                className="group cursor-pointer focus:outline-none"
                onMouseEnter={() => setHoverRating(ratingValue)}
                onClick={() => handleRate(ratingValue)}
              >
                <Star
                  className={`h-4 w-4 transition-all duration-200 sm:h-5 sm:w-5 ${
                    isFilled
                      ? "scale-110 fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" // Biraz parlasın
                      : "scale-100 fill-transparent text-gray-300 group-hover:text-yellow-500/50 dark:text-gray-600" // Hoverda hafif sararsın
                  }`}
                />
              </button>
            );
          })}
        </div>

        {selectedRating === 0 && (
          <p className="mt-1 text-center text-[10px] text-gray-400 dark:text-gray-500">
            Puan vermek için yıldızlara tıkla.
          </p>
        )}
      </div>
    </div>
  );
}
