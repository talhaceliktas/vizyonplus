"use client";

import React from "react";
import Link from "next/link";
import { Lock, Crown, ChevronRight } from "lucide-react";

export default function AboneOlKarti() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-yellow-500/30 bg-gray-900/80 p-12 text-center backdrop-blur-sm md:p-16">
      {/* Arka Plan Efekti */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent" />

      {/* İkon */}
      <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
        <Lock className="h-10 w-10 text-yellow-500" />
        <div className="absolute -top-1 -right-1 rounded-full bg-gray-900 p-1">
          <Crown className="h-4 w-4 text-yellow-500" />
        </div>
      </div>

      {/* Başlık ve Açıklama */}
      <h3 className="relative z-10 mb-3 text-2xl font-bold text-white">
        Bu İçeriği İzlemek İçin Abone Olun
      </h3>
      <p className="relative z-10 mb-8 max-w-md text-gray-400">
        Dizinin tüm sezonlarına ve bölümlerine erişmek, reklamsız ve kesintisiz
        izlemek için Vizyon+ ayrıcalıklarına katılın.
      </p>

      {/* Aksiyon Butonu */}
      <Link
        href="/abonelikler"
        className="group relative z-10 flex items-center gap-2 rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black shadow-lg shadow-yellow-500/20 transition-all hover:scale-105 hover:bg-yellow-400 hover:shadow-yellow-500/40 active:scale-95"
      >
        <span>Planları İncele</span>
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
