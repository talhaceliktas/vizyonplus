"use client";

/**
 * Bu bileşen, tek bir abonelik paketinin fiyat ve özellik bilgilerini gösteren karttır.
 * Kullanıcının mevcut durumuna göre (aktif abonelik, yükseltme, düşürme) kartın görünümü ve buton işlevi değişir.
 */

import { Check, X, Loader2, CheckCircle2, ArrowUpCircle } from "lucide-react";
import { AbonelikPaketi } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Yönlendirme için

interface PricingCardProps {
  plan: AbonelikPaketi; // Gösterilecek paket verisi
  isPopular?: boolean; // "En Popüler" etiketi gösterilsin mi? (Sunucudan gelen bilgiye göre)
  isCurrent?: boolean; // Kullanıcının şu anki aktif paketi mi?
  hasActiveSubscription?: boolean; // Kullanıcının herhangi bir aktif aboneliği var mı?
  currentPlanPrice?: number; // Kullanıcının mevcut paketinin fiyatı (Yükseltme/Düşürme kontrolü için)
}

export default function PricingCard({
  plan,
  isPopular,
  isCurrent,
  hasActiveSubscription = false,
  currentPlanPrice = 0,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Yükseltme mi? (Aktif abonelik var, bu paket mevcut değil VE fiyatı mevcut paketten yüksek)
  const isUpgrade =
    hasActiveSubscription && !isCurrent && plan.fiyat > currentPlanPrice;

  // Düşürme veya Aynı Fiyat mı? (Aktif abonelik var, bu paket mevcut değil VE fiyatı mevcut pakete eşit veya düşük)
  const isDowngradeOrSame =
    hasActiveSubscription && !isCurrent && plan.fiyat <= currentPlanPrice;

  /**
   * "Abone Ol" butonuna tıklandığında çalışır.
   * Kullanıcıyı ödeme sayfasına yönlendirir.
   */
  const handleSubscribe = async () => {
    // Mevcut plan veya düşürme durumu ise işlem yapma (Buton zaten disabled olmalı ama güvenlik için)
    if (isCurrent || isDowngradeOrSame) return;

    setLoading(true);

    // Ödeme sayfasına, seçilen planın ID'si ile yönlendir
    router.push(`/odeme?plan=${plan.id}`);
  };

  // Kartın stil mantığı (Duruma göre renk ve gölge değişimi)
  const containerClasses = isCurrent
    ? "border-green-500 bg-green-50 shadow-xl shadow-green-500/10 scale-105 z-20 ring-1 ring-green-500 dark:bg-green-500/5 dark:shadow-green-500/10" // Mevcut Plan
    : isPopular
      ? "border-yellow-500 bg-white shadow-xl shadow-yellow-500/20 md:scale-110 md:z-10 dark:bg-white/10 dark:shadow-yellow-500/10" // Popüler
      : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"; // Standart

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${containerClasses} ${
        // Düşük paketleri soluk göster
        isDowngradeOrSame ? "opacity-60 grayscale-[0.5]" : ""
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
        // Mevcut plan veya daha düşük plan ise buton devre dışı
        disabled={loading || isCurrent || isDowngradeOrSame}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold shadow-sm transition-all ${
          isCurrent
            ? // Mevcut Plan: Yeşil ve Pasif
              "cursor-default border border-green-500/50 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
            : isUpgrade
              ? // Yükseltme: Mavi/Mor (Dikkat çekici)
                "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
              : isDowngradeOrSame
                ? // Düşük Paket: Gri ve Pasif
                  "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 dark:border-white/5 dark:bg-white/5 dark:text-gray-500"
                : isPopular
                  ? // Normal Popüler: Sarı
                    "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20"
                  : // Normal Standart: Siyah/Beyaz
                    "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        }`}
      >
        {loading ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : isCurrent ? (
          "Aktif Paket"
        ) : isUpgrade ? (
          <>
            <ArrowUpCircle size={18} /> Yükselt
          </>
        ) : isDowngradeOrSame ? (
          "Kapsam Dışı" // veya "Daha Düşük Plan"
        ) : (
          "Abone Ol"
        )}
      </button>
    </div>
  );
}
