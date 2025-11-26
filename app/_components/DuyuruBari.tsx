"use client";

import { useState } from "react";
import {
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
  FaFire,
  FaBullhorn,
} from "react-icons/fa";

export default function DuyuruBari({ settings }) {
  const [kapali, setKapali] = useState(false);

  // Settings yoksa veya aktif değilse render etme
  if (!settings || !settings.duyuru_aktif || kapali) return null;

  const { duyuru_metni, duyuru_tipi } = settings;

  const stilAyarlari = {
    bilgi: {
      classes:
        "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white border-blue-700",
      icon: <FaInfoCircle />,
    },
    uyari: {
      classes:
        "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-neutral-900 border-amber-500",
      icon: <FaExclamationTriangle />,
    },
    kritik: {
      classes:
        "bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white border-red-800",
      icon: <FaFire />,
    },
    varsayilan: {
      classes:
        "bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 text-white border-neutral-600",
      icon: <FaBullhorn />,
    },
  };

  const secilenStil = stilAyarlari[duyuru_tipi] || stilAyarlari.varsayilan;

  return (
    <div
      className={`animate-in slide-in-from-top relative z-50 w-full overflow-hidden border-b shadow-lg transition-all duration-500 ${secilenStil.classes}`}
    >
      {/* --- ŞERİT KATMANI (OVERLAY) --- */}
      {/* Bu div, ana rengin üzerine oturur ve sadece desen verir */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              #ffffff,
              #ffffff 10px,
              transparent 10px,
              transparent 20px
            )
          `,
        }}
      />

      {/* --- İÇERİK --- */}
      <div className="relative z-10 container mx-auto flex min-h-[40px] items-center justify-center px-4 py-2">
        <div className="flex items-center gap-x-3 shadow-sm">
          {/* İkon */}
          <span className="animate-pulse text-sm opacity-90 drop-shadow-md">
            {secilenStil.icon}
          </span>

          {/* Metin */}
          <span className="text-xs font-bold tracking-widest uppercase drop-shadow-md sm:text-sm">
            {duyuru_metni}
          </span>
        </div>

        {/* Kapatma Butonu */}
      </div>
      <button
        onClick={() => setKapali(true)}
        className="absolute top-1/2 right-6 -translate-y-1/2 rounded-full p-1.5 opacity-70 transition-all hover:bg-black/20 hover:opacity-100"
        aria-label="Duyuruyu Kapat"
      >
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
}
