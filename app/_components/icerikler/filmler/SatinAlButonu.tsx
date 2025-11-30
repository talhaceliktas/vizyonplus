"use client";

import React, { useState } from "react";
import { Ticket } from "lucide-react";
import FilmSatinAlmaModal from "./FilmSatinAlmaModal"; // Yeni modalı import et

type SatinAlButonuProps = {
  filmId: number;
  filmAdi: string;
  fiyat: number;
};

export default function SatinAlButonu({
  filmId,
  filmAdi,
  fiyat,
}: SatinAlButonuProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative flex w-full items-stretch overflow-hidden rounded-xl transition-all active:scale-95 sm:w-auto"
      >
        <div className="absolute inset-0 bg-gray-900 transition-colors hover:bg-black dark:bg-white dark:hover:bg-gray-200" />
        <div className="absolute inset-0 opacity-0 shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-1 items-center justify-center gap-3 px-6 py-4">
          <Ticket className="h-5 w-5 text-yellow-500 transition-transform duration-300 group-hover:-rotate-12" />
          <span className="font-bold text-white dark:text-black">Satın Al</span>
        </div>

        <div className="relative z-10 my-3 w-px bg-gray-700 dark:bg-gray-300" />

        <div className="relative z-10 flex items-center justify-center bg-white/5 px-5 py-4 transition-colors group-hover:bg-yellow-500/10 dark:bg-black/5">
          <span className="text-lg font-black tracking-tight text-yellow-500 dark:text-yellow-600">
            {fiyat} ₺
          </span>
        </div>
      </button>

      {/* --- ÖDEME MODALI --- */}
      <FilmSatinAlmaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filmId={filmId}
        filmAdi={filmAdi}
        fiyat={fiyat}
      />
    </>
  );
}
