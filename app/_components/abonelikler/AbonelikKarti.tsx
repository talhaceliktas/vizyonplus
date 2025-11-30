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
          ? "border-2 border-yellow-500/50 bg-gray-900 shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)]"
          : "border border-white/10 bg-gray-900/50 hover:border-white/20 hover:bg-gray-900"
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
        <h3 className="mb-2 text-2xl font-bold tracking-wide text-white">
          {plan.paket_adi}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{plan.fiyat} ₺</span>
          <span className="text-sm text-gray-400">/ ay</span>
        </div>
      </div>

      <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Özellik Listesi */}
      <ul className="mb-8 flex-grow space-y-4">
        {plan.ozellikler.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
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
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-gray-500">
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
            <span
              className={`text-sm ${feature.included ? "text-gray-300" : "text-gray-600 line-through"}`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        disabled={isLoading}
        onClick={() => onPlanSec(plan.id, plan.paket_adi)}
        className={`w-full rounded-xl py-4 text-sm font-bold transition-all active:scale-95 ${
          isHighlighted
            ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-400"
            : "bg-white/10 text-white hover:bg-white/20"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isLoading ? "İşleniyor..." : "Planı Seç"}
      </button>
    </div>
  );
};

export default AbonelikKarti;
