"use client";

import { Check, X, Loader2, CheckCircle2 } from "lucide-react";
import { AbonelikPaketi } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

interface PricingCardProps {
  plan: AbonelikPaketi;
  isPopular?: boolean;
  isCurrent?: boolean;
  hasActiveSubscription?: boolean; // YENİ: Kullanıcının herhangi bir aktif aboneliği var mı?
}

export default function PricingCard({
  plan,
  isPopular,
  isCurrent,
  hasActiveSubscription = false, // Varsayılan false
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    // Eğer herhangi bir aktif abonelik varsa işlem yapma
    if (hasActiveSubscription) return;

    setLoading(true);
    // Demo işlem
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`${plan.paket_adi} paketi seçildi!`);
    setLoading(false);
  };

  // Kartın stil mantığı
  const containerClasses = isCurrent
    ? "border-green-500 bg-green-50 shadow-xl shadow-green-500/10 scale-105 z-20 ring-1 ring-green-500 dark:bg-green-500/5 dark:shadow-green-500/10"
    : isPopular
      ? "border-yellow-500 bg-white shadow-xl shadow-yellow-500/20 md:scale-110 md:z-10 dark:bg-white/10 dark:shadow-yellow-500/10"
      : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20";

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${containerClasses} ${
        // Aktif abonelik varsa ve bu kart o değilse, biraz soluk göster
        hasActiveSubscription && !isCurrent ? "opacity-75 grayscale-[0.5]" : ""
      }`}
    >
      {/* --- ETİKETLER --- */}

      {/* 1. Mevcut Plan Etiketi */}
      {isCurrent && (
        <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-green-500 px-4 py-1 text-xs font-bold tracking-wide text-white uppercase shadow-lg shadow-green-500/20">
          <CheckCircle2 size={14} /> Mevcut Plan
        </div>
      )}

      {/* 2. Popüler Etiketi (Mevcut değilse ve popülerse) */}
      {!isCurrent && isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-500 px-4 py-1 text-xs font-bold tracking-wide text-black uppercase shadow-lg shadow-yellow-500/20">
          En Popüler
        </div>
      )}

      {/* Başlık ve Fiyat */}
      <div className="mt-2 mb-6 text-center">
        <h3
          className={`text-lg font-medium tracking-widest uppercase ${
            isCurrent
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-300"
          }`}
        >
          {plan.paket_adi}
        </h3>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {plan.fiyat} ₺
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/ Ay</span>
        </div>
      </div>

      {/* Özellikler Listesi */}
      <ul className="mb-8 flex-1 space-y-4">
        {plan.ozellikler.map((ozellik, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            {ozellik.included ? (
              <Check
                className={`h-5 w-5 shrink-0 ${
                  isCurrent
                    ? "text-green-600 dark:text-green-400"
                    : "text-green-600 dark:text-green-500"
                }`}
              />
            ) : (
              <X className="h-5 w-5 shrink-0 text-red-500/70 dark:text-red-500/50" />
            )}
            <span
              className={
                ozellik.included
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-gray-400 line-through dark:text-gray-600"
              }
            >
              {ozellik.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Buton */}
      <button
        onClick={handleSubscribe}
        // Eğer herhangi bir aktif abonelik varsa buton disabled olur
        disabled={loading || hasActiveSubscription}
        className={`w-full rounded-xl py-3 font-bold shadow-sm transition-all ${
          isCurrent
            ? // Mevcut Plan: Yeşil ve Pasif
              "cursor-default border border-green-500/50 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
            : hasActiveSubscription
              ? // Başka Plan Aktif: Gri ve Pasif (Tıklanamaz)
                "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 dark:border-white/5 dark:bg-white/5 dark:text-gray-500"
              : isPopular
                ? // Normal Durum (Popüler): Sarı
                  "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20"
                : // Normal Durum (Standart): Siyah/Beyaz
                  "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        }`}
      >
        {loading ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : isCurrent ? (
          "Aktif Paket"
        ) : hasActiveSubscription ? (
          "Üyelik Mevcut" // Kullanıcıya neden tıklayamadığını belirten mesaj
        ) : (
          "Abone Ol"
        )}
      </button>
    </div>
  );
}
