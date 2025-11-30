"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { puanVer } from "../../../_lib/data-service-server";
import toast from "react-hot-toast";

type IcerikPuanlaProps = {
  icerikId: number;
  mevcutPuan: number | null;
};

export default function IcerikPuanla({
  icerikId,
  mevcutPuan,
}: IcerikPuanlaProps) {
  const [hoverPuan, setHoverPuan] = useState(0);
  const [seciliPuan, setSeciliPuan] = useState(mevcutPuan || 0);
  const [loading, setLoading] = useState(false);

  const handlePuanVer = async (puan: number) => {
    setLoading(true);
    // Optimistic Update (Hemen arayüzde göster)
    setSeciliPuan(puan);

    const res = await puanVer(icerikId, puan);

    if (res.error) {
      toast.error(res.error);
      setSeciliPuan(mevcutPuan || 0); // Hata varsa geri al
    } else {
      toast.success(`${puan} puan verdiniz!`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-300">Puanın:</span>
        <span
          className={`text-lg font-black ${seciliPuan > 0 ? "text-yellow-500" : "text-gray-600"}`}
        >
          {hoverPuan || seciliPuan || "-"}{" "}
          <span className="text-xs font-medium text-gray-500">/ 10</span>
        </span>
      </div>

      <div
        className="flex items-center gap-1"
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
              className={`transition-transform hover:scale-125 focus:outline-none ${loading ? "cursor-wait opacity-50" : "cursor-pointer"}`}
              onMouseEnter={() => setHoverPuan(ratingValue)}
              onClick={() => handlePuanVer(ratingValue)}
            >
              <Star
                className={`h-5 w-5 transition-colors duration-200 ${
                  isActive
                    ? "fill-yellow-500 text-yellow-500"
                    : "fill-transparent text-gray-600"
                }`}
              />
            </button>
          );
        })}
      </div>

      <p className="mt-1 text-center text-[10px] text-gray-500">
        Değiştirmek için tekrar tıklayın.
      </p>
    </div>
  );
}
