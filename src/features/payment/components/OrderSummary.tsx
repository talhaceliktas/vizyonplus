import { Check } from "lucide-react";
import { AbonelikPaketi } from "@/types";

interface OrderSummaryProps {
  plan: AbonelikPaketi;
}

export default function OrderSummary({ plan }: OrderSummaryProps) {
  // Veritabanından gelen fiyat üzerinden hesaplama
  const fiyat = Number(plan.fiyat);
  const kdv = fiyat * 0.2; // %20 KDV varsayımı
  // Genelde DB fiyatı KDV dahil olur, ona göre mantık kurabilirsin.
  // Burada Fiyat = Toplam varsayıyoruz, kdv içinden ayrılıyor gibi gösterelim.
  const araToplam = fiyat - kdv;

  return (
    <div className="h-fit rounded-2xl border border-yellow-500/20 bg-linear-to-b from-yellow-500/10 to-transparent p-6 lg:p-8">
      <h3 className="mb-6 text-lg font-bold tracking-widest text-white uppercase">
        Sipariş Özeti
      </h3>

      {/* Paket Detayı */}
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h4 className="text-xl font-bold text-yellow-500">
            {plan.paket_adi}
          </h4>
          <span className="text-sm text-gray-400">Aylık Abonelik</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {fiyat.toFixed(2)} ₺
          </div>
        </div>
      </div>

      {/* Özellikler */}
      <ul className="mb-8 space-y-3">
        {plan.ozellikler
          .filter((f) => f.included) // Sadece dahil olan özellikleri göster
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

      {/* Toplam */}
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
          <span className="text-lg font-bold text-white">Genel Toplam</span>
          <span className="text-2xl font-bold text-yellow-500">
            {fiyat.toFixed(2)} ₺
          </span>
        </div>
      </div>
    </div>
  );
}
