"use client";

import { useState } from "react";
import { Star, Users } from "lucide-react"; // Users ikonu eklendi
import { puanVer } from "../../../_lib/data-service-server";
import toast from "react-hot-toast";

type IcerikPuanlaProps = {
  icerikId: number;
  mevcutPuan: number | null;
  genelPuan: {
    ortalama: number;
    oySayisi: number;
  };
};

export default function IcerikPuanla({
  icerikId,
  mevcutPuan,
  genelPuan,
}: IcerikPuanlaProps) {
  const [hoverPuan, setHoverPuan] = useState(0);
  const [seciliPuan, setSeciliPuan] = useState(mevcutPuan || 0);
  const [loading, setLoading] = useState(false);

  // Optimistic UI için yerel state (Yeni oy verince ortalama anlık değişsin diye)
  // Basit matematik: Yeni ortalamayı tam hesaplamak zor olacağı için sadece kullanıcı tarafını güncelliyoruz
  // Gerçek veri sayfa yenilenince gelir.

  const handlePuanVer = async (puan: number) => {
    setLoading(true);
    setSeciliPuan(puan);

    const res = await puanVer(icerikId, puan);

    if (res.error) {
      toast.error(res.error);
      setSeciliPuan(mevcutPuan || 0);
    } else {
      toast.success(`${puan} puan verdiniz!`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/10">
      {/* --- ÜST KISIM: GENEL ORTALAMA --- */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-medium text-gray-400">
            Vizyon+ Puanı
          </span>
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-1.5">
              <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
              <span className="text-2xl font-black text-white">
                {genelPuan.ortalama > 0 ? genelPuan.ortalama : "-"}
              </span>
            </div>
            <span className="mb-1 text-sm font-medium text-gray-500">/ 10</span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Users className="h-4 w-4" />
            <span className="text-xs font-bold text-gray-300">
              {genelPuan.oySayisi} Oy
            </span>
          </div>
          <span className="text-[10px] text-gray-600">kullanıcı oyladı</span>
        </div>
      </div>

      {/* --- ALT KISIM: KULLANICI PUANLAMASI --- */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-300">Senin Puanın:</span>
          <span
            className={`text-lg font-black ${
              seciliPuan > 0 ? "text-secondary-2" : "text-gray-600"
            }`}
          >
            {hoverPuan || seciliPuan || "-"}{" "}
            <span className="text-xs font-medium text-gray-500">/ 10</span>
          </span>
        </div>

        <div
          className="flex items-center justify-between gap-1"
          onMouseLeave={() => setHoverPuan(0)}
        >
          {[...Array(10)].map((_, i) => {
            const ratingValue = i + 1;
            const isActive = ratingValue <= (hoverPuan || seciliPuan);

            return (
              <button
                key={i}
                type="button"
                disabled={loading}
                className={`transition-transform hover:scale-110 focus:outline-none ${
                  loading ? "cursor-wait opacity-50" : "cursor-pointer"
                }`}
                onMouseEnter={() => setHoverPuan(ratingValue)}
                onClick={() => handlePuanVer(ratingValue)}
              >
                <Star
                  className={`h-4 w-4 transition-colors duration-200 sm:h-5 sm:w-5 ${
                    isActive
                      ? "fill-secondary-2 text-secondary-2" // Senin temanın sarı/gold rengi
                      : "fill-transparent text-gray-600"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {seciliPuan === 0 && (
          <p className="mt-1 text-center text-[10px] text-gray-500">
            Puan vermek için yıldızlara tıkla.
          </p>
        )}
      </div>
    </div>
  );
}
