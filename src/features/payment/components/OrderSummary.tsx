/**
 * Bu bileşen, ödeme sayfasında gösterilen sipariş özetidir.
 * Seçilen paketin adını, fiyatını, KDV detaylarını ve ödenecek toplam tutarı gösterir.
 * Yükseltme durumunda özel fiyat (`customPrice`) desteği sunar.
 */

import { Check } from "lucide-react";
import { AbonelikPaketi } from "@/types";

interface OrderSummaryProps {
  plan: AbonelikPaketi; // Satın alınan paket
  customPrice?: number; // Yükseltme durumunda hesaplanan özel fiyat (varsa)
}

export default function OrderSummary({ plan, customPrice }: OrderSummaryProps) {
  // Eğer özel bir fiyat belirtilmişse (upgrade farkı gibi) onu kullan, yoksa paketin normal fiyatını al
  const finalPrice = customPrice !== undefined ? customPrice : plan.fiyat;

  // Vergi hesaplaması (Basit %20 KDV örneği)
  const kdv = finalPrice * 0.2;
  const araToplam = finalPrice - kdv;

  return (
    <div className="h-fit rounded-2xl border border-yellow-500/20 bg-linear-to-b from-yellow-500/10 to-transparent p-6 lg:p-8">
      <h3 className="mb-6 text-lg font-bold tracking-widest text-white uppercase">
        Sipariş Özeti
      </h3>

      {/* Paket Başlığı ve Fiyatı */}
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h4 className="text-xl font-bold text-yellow-500">
            {plan.paket_adi}
          </h4>
          <span className="text-sm text-gray-400">
            {customPrice !== undefined
              ? "Paket Yükseltme Farkı"
              : "Aylık Abonelik"}
          </span>
        </div>
        <div className="flex flex-col items-end text-right">
          {/* Eğer özel fiyat varsa (indirim/upgrade), orijinal fiyatı çizili göster */}
          {customPrice !== undefined && (
            <span className="text-sm text-gray-500 line-through decoration-red-500 decoration-2">
              {plan.fiyat} ₺
            </span>
          )}
          <div className="text-2xl font-bold text-white">
            {finalPrice.toFixed(2)} ₺
          </div>
        </div>
      </div>

      {/* Paket Özellikleri Listesi */}
      <ul className="mb-8 space-y-3">
        {plan.ozellikler
          .filter((f) => f.included)
          .map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm text-gray-300"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                <Check size={12} className="text-green-500" />
              </div>
              {feature.text}
            </li>
          ))}
      </ul>

      {/* Fiyat Detayları (Ara Toplam, KDV, Genel Toplam) */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Ara Toplam</span>
          <span>{araToplam.toFixed(2)} ₺</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>KDV (%20)</span>
          <span>{kdv.toFixed(2)} ₺</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
          <span className="text-lg font-bold text-white">Ödenecek Tutar</span>
          <span className="text-2xl font-bold text-yellow-500">
            {finalPrice.toFixed(2)} ₺
          </span>
        </div>
      </div>
    </div>
  );
}
