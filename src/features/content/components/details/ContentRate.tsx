"use client";

import { useState } from "react";
import { Star, Users } from "lucide-react";
import toast from "react-hot-toast";
import { rateContent } from "../../actions/content-actions"; // Yolunu kontrol et

interface ContentRateProps {
  contentId: number;
  userRating: number | null;
  averageRating: {
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
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [loading, setLoading] = useState(false);

  const handleRate = async (rating: number) => {
    setLoading(true);
    setSelectedRating(rating);

    const res = await rateContent(contentId, rating);

    if (res.error) {
      toast.error(res.error);
      setSelectedRating(userRating || 0);
    } else {
      toast.success(`${rating} puan verdiniz!`);
    }
    setLoading(false);
  };

  return (
    // CONTAINER: Aydınlıkta gri zemin/border, Karanlıkta cam efekti
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 transition-colors dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm dark:hover:bg-white/10">
      {/* GENEL ORTALAMA */}
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

      {/* KULLANICI PUANLAMASI */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Senin Puanın:
          </span>
          <span
            className={`text-lg font-black ${
              selectedRating > 0
                ? "text-yellow-500"
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
            const isActive = ratingValue <= (hoverRating || selectedRating);

            return (
              <button
                key={i}
                type="button"
                disabled={loading}
                className={`transition-transform hover:scale-110 focus:outline-none ${
                  loading ? "cursor-wait opacity-50" : "cursor-pointer"
                }`}
                onMouseEnter={() => setHoverRating(ratingValue)}
                onClick={() => handleRate(ratingValue)}
              >
                <Star
                  className={`h-4 w-4 transition-colors duration-200 sm:h-5 sm:w-5 ${
                    isActive
                      ? "fill-yellow-500 text-yellow-500" // Aktifse Sarı
                      : "fill-transparent text-gray-300 dark:text-gray-600" // Pasifse Gri (Light modda açık gri, Dark modda koyu gri)
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
