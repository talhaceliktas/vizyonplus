import React from "react";
import { AbonelikPlani } from "../../types";

type AbonelikKartiProps = {
  plan: AbonelikPlani;
  onPlanSec: (id: number, ad: string) => void;
  isLoading: boolean;
};

const AbonelikKarti: React.FC<AbonelikKartiProps> = ({
  plan,
  onPlanSec,
  isLoading,
}) => {
  const isHighlighted = plan.paket_adi === "Standart";

  return (
    <div
      className={`group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 ${
        isHighlighted
          ? // --- HIGHLIGHT (STANDART PAKET) TASARIMI ---
            // Light: Beyaz zemin, Sarı Border, Sarı Gölge
            // Dark: Gri-900 zemin, Sarı Border, Sarı Glow
            "border-2 border-yellow-500 bg-white shadow-xl shadow-yellow-500/20 dark:border-yellow-500/50 dark:bg-gray-900 dark:shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)]"
          : // --- NORMAL PAKET TASARIMI ---
            // Light: Beyaz zemin, Gri Border
            // Dark: Yarı saydam gri zemin, Beyaz/10 Border
            "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg dark:border-white/10 dark:bg-gray-900/50 dark:hover:border-white/20 dark:hover:bg-gray-900"
      }`}
    >
      {/* Popüler Rozeti */}
      {isHighlighted && (
        <div className="absolute -top-4 right-0 left-0 mx-auto w-max">
          <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-4 py-1 text-xs font-bold text-black shadow-lg">
            ★ EN POPÜLER
          </span>
        </div>
      )}

      <div className="mb-8">
        {/* Başlık: Light->Siyah, Dark->Beyaz */}
        <h3 className="mb-2 text-2xl font-bold tracking-wide text-gray-900 dark:text-gray-100">
          {plan.paket_adi}
        </h3>

        <div className="flex items-baseline gap-1">
          {/* Fiyat: Light->Koyu Gri, Dark->Beyaz */}
          <span className="text-4xl font-black text-gray-800 dark:text-white">
            {plan.fiyat} ₺
          </span>
          {/* /ay: Light->Gri-500, Dark->Gri-400 */}
          <span className="text-sm text-gray-500 dark:text-gray-400">/ ay</span>
        </div>
      </div>

      {/* Divider: Gradient rengini temaya göre ayarla */}
      <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/20" />

      {/* Özellik Listesi */}
      <ul className="mb-8 flex-grow space-y-4">
        {plan.ozellikler.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              // TİK İKONU: Light-> Yeşil-100 zemin / Yeşil-600 ikon | Dark-> Yeşil-500/20 zemin / Yeşil-400 ikon
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              // ÇARPI İKONU: Light-> Kırmızı-100 zemin / Kırmızı-500 ikon | Dark-> Kırmızı-500/10 zemin / Gri ikon
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10 dark:text-gray-500">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}

            {/* ÖZELLİK METNİ */}
            <span
              className={`text-sm ${
                feature.included
                  ? "text-gray-700 dark:text-gray-300" // Dahil: Koyu Gri / Açık Gri
                  : "text-gray-400 line-through dark:text-gray-600" // Hariç: Silik Gri
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* BUTON */}
      <button
        disabled={isLoading}
        onClick={() => onPlanSec(plan.id, plan.paket_adi)}
        className={`w-full rounded-xl py-4 text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
          isHighlighted
            ? // Highlight Buton: Her iki modda da Sarı zemin, Siyah yazı
              "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-400"
            : // Normal Buton: Light-> Gri Zemin / Koyu Yazı | Dark-> Beyaz/10 zemin / Beyaz yazı
              "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        }`}
      >
        {isLoading ? "İşleniyor..." : "Planı Seç"}
      </button>
    </div>
  );
};

export default AbonelikKarti;
