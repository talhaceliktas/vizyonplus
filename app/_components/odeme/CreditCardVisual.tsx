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
  cvc: string; // CVC eklendi
  focusedField: string | null;
}

const CreditCardVisual: React.FC<CardProps> = ({
  cardNumber,
  cardName,
  expiry,
  cvc,
  focusedField,
}) => {
  // Kart numarasını 4'erli gruplara bölme
  const formattedNumber =
    (cardNumber || "••••••••••••••••")
      .replace(/\D/g, "") // Sadece rakamları al
      .padEnd(16, "•")
      .match(/.{1,4}/g)
      ?.join(" ") || "•••• •••• •••• ••••";

  // CVC alanına odaklanıldıysa kartı ters çevir
  const isFlipped = focusedField === "cvc";

  // Ortak Arka Plan Stili (Hem ön hem arka yüz için)
  const cardBackgroundClass =
    "absolute inset-0 z-0 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-zinc-900 to-black border border-white/10";
  const noiseOverlay = (
    <>
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-500/20 blur-[60px]" />
      <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-purple-600/20 blur-[60px]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    </>
  );

  return (
    <div className="perspective-1000 group relative h-56 w-full max-w-[380px] text-white select-none">
      {/* --- DÖNEN KAPSAYICI --- */}
      <div
        className={cn(
          "relative h-full w-full transition-all duration-700 [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : "",
        )}
      >
        {/* =================ÖN YÜZ================= */}
        <div className="absolute inset-0 h-full w-full rounded-2xl shadow-2xl [backface-visibility:hidden]">
          <div className={cardBackgroundClass}>{noiseOverlay}</div>

          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            {/* Üst Kısım: Çip ve Logo */}
            <div className="flex items-start justify-between">
              {/* Gerçekçi EMV Çip Tasarımı */}
              <div className="relative h-10 w-12 overflow-hidden rounded-md border border-yellow-600/50 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 shadow-sm">
                <div className="absolute top-1/2 left-0 h-[1px] w-full -translate-y-1/2 bg-black/20" />
                <div className="absolute top-0 left-1/2 h-full w-[1px] -translate-x-1/2 bg-black/20" />
                <div className="absolute top-1/2 left-1/2 h-4 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10" />
              </div>

              <span className="font-mono text-lg font-bold tracking-wider text-yellow-500 italic opacity-80">
                VIZYON+
              </span>
            </div>

            {/* Orta Kısım: Numara */}
            <div className="mt-2">
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
                <p className="text-[10px] text-gray-400 uppercase">
                  Kart Sahibi
                </p>
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

        {/* =================ARKA YÜZ================= */}
        <div className="absolute inset-0 h-full w-full [transform:rotateY(180deg)] rounded-2xl shadow-2xl [backface-visibility:hidden]">
          <div className={cardBackgroundClass}>{noiseOverlay}</div>

          <div className="relative z-10 flex h-full flex-col justify-between py-6">
            {/* Manyetik Şerit */}
            <div className="h-12 w-full bg-black/80 backdrop-blur-md" />

            {/* CVC Alanı */}
            <div className="px-6">
              <div className="flex flex-col items-end">
                <p className="mr-2 text-[10px] font-bold text-white uppercase">
                  CVC / CVV
                </p>
                <div className="flex h-10 w-full items-center justify-end rounded bg-white px-3">
                  <p className="font-mono text-lg font-bold tracking-widest text-black">
                    {cvc || "•••"}
                  </p>
                </div>
              </div>
            </div>

            {/* Alt Logo (Ters) */}
            <div className="px-6 text-right">
              <span className="font-mono text-lg font-bold tracking-wider text-yellow-500 italic opacity-60">
                VIZYON+
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardVisual;
