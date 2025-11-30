import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  cardNumber: string;
  cardName: string;
  expiry: string;
  focusedField: string | null;
}

const CreditCardVisual: React.FC<CardProps> = ({
  cardNumber,
  cardName,
  expiry,
  focusedField,
}) => {
  const formattedNumber =
    (cardNumber || "••••••••••••••••")
      .padEnd(16, "•")
      .match(/.{1,4}/g)
      ?.join(" ") || "•••• •••• •••• ••••";

  return (
    <div className="relative h-56 w-full max-w-[380px] rounded-2xl p-6 text-white shadow-2xl transition-transform duration-500 select-none hover:scale-[1.02]">
      {/* --- ARKA PLAN (Glassmorphism & Gradient) --- */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-zinc-900 to-black">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-500/20 blur-[60px]" />
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-purple-600/20 blur-[60px]" />
        <div className="absolute inset-0 rounded-2xl border border-white/10" />
        {/* Noise Texture effect overlay (Optional) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* --- İÇERİK --- */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Üst Kısım: Çip ve Logo */}
        <div className="flex items-start justify-between">
          <svg className="h-10 w-12 fill-yellow-500/80" viewBox="0 0 48 48">
            <path
              d="M6 10C6 7.79 7.79 6 10 6H38C40.21 6 42 7.79 42 10V38C42 40.21 40.21 42 38 42H10C7.79 42 6 40.21 6 38V10Z"
              fillOpacity="0.2"
            />
            <path
              d="M42 18H32M28 22V26M6 18H16M24 6V18M24 30V42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <span className="font-mono text-lg font-bold tracking-wider text-yellow-500 italic opacity-80">
            VIZYON+
          </span>
        </div>

        {/* Orta Kısım: Numara */}
        <div className="mt-4">
          <div
            className={cn(
              "rounded-lg border border-transparent px-2 py-1 transition-all duration-300",
              focusedField === "cardNumber" &&
                "border-white/20 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)]",
            )}
          >
            <p className="font-mono text-2xl font-medium tracking-widest text-white drop-shadow-md">
              {formattedNumber}
            </p>
          </div>
        </div>

        {/* Alt Kısım: İsim ve Tarih */}
        <div className="flex justify-between gap-4">
          <div
            className={cn(
              "flex-1 rounded-lg border border-transparent px-2 py-1 transition-all duration-300",
              focusedField === "cardName" && "border-white/20 bg-white/5",
            )}
          >
            <p className="text-[10px] text-gray-400 uppercase">Kart Sahibi</p>
            <p className="truncate font-mono text-sm font-medium tracking-wide uppercase">
              {cardName || "AD SOYAD"}
            </p>
          </div>

          <div
            className={cn(
              "rounded-lg border border-transparent px-2 py-1 transition-all duration-300",
              focusedField === "expiry" && "border-white/20 bg-white/5",
            )}
          >
            <p className="text-[10px] text-gray-400 uppercase">SKT</p>
            <p className="font-mono text-sm font-medium tracking-wide">
              {expiry || "AA/YY"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardVisual;
