"use client";

import { useState } from "react";
import { Lock, CreditCard, Calendar, User, Loader2 } from "lucide-react";

interface CreditCardFormProps {
  onSubmit: () => Promise<void>; // Dışarıdan gelen işlem fonksiyonu
  isLoading: boolean;
  buttonText?: string;
}

export default function CreditCardForm({
  onSubmit,
  isLoading,
  buttonText = "Ödemeyi Tamamla",
}: CreditCardFormProps) {
  // Input State'leri
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // --- FORMATLAMA FONKSİYONLARI ---

  // Kart Numarası: 4'lü gruplama (2322 2132...)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece rakamları al
    const rawValue = e.target.value.replace(/\D/g, "");
    // 4 karakterde bir boşluk ekle
    const formattedValue = rawValue
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19); // 16 rakam + 3 boşluk = 19 karakter sınır

    setCardNumber(formattedValue);
  };

  // Son Kullanma: Araya / koyma (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece rakamları al
    let rawValue = e.target.value.replace(/\D/g, "");

    // Ay kontrolü (opsiyonel ama şık): İlk rakam > 1 ise başına 0 koy (örn: 5 -> 05)
    // Ancak basitlik için sadece formatlayalım:
    if (rawValue.length >= 3) {
      rawValue = rawValue.slice(0, 2) + "/" + rawValue.slice(2, 4);
    }

    setExpiry(rawValue.slice(0, 5)); // 5 karakter sınır (MM/YY)
  };

  // CVC: Sadece rakam ve 3 hane
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvc(rawValue);
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:p-8">
      {/* Başlık ve Güvenlik İkonu */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Kart Bilgileri</h2>
        <div className="flex items-center gap-2 text-xs text-green-400">
          <Lock size={14} />
          <span>256-bit SSL ile korunmaktadır</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Kart Üzerindeki İsim */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">
            Kart Üzerindeki İsim
          </label>
          <div className="relative">
            <User
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Ad Soyad"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pr-4 pl-12 text-white placeholder-gray-600 transition-all outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              required
            />
          </div>
        </div>

        {/* 2. Kart Numarası */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">
            Kart Numarası
          </label>
          <div className="relative">
            <CreditCard
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pr-4 pl-12 text-white placeholder-gray-600 transition-all outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              required
            />
          </div>
        </div>

        {/* 3. Son Kullanma Tarihi ve CVC */}
        <div className="grid grid-cols-2 gap-5">
          {/* Son Kullanma */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Son Kullanma
            </label>
            <div className="relative">
              <Calendar
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="AA/YY"
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pr-4 pl-12 text-white placeholder-gray-600 transition-all outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                required
              />
            </div>
          </div>

          {/* CVC */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              CVC / CVV
            </label>
            <div className="relative">
              <Lock
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="123"
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pr-4 pl-12 text-white placeholder-gray-600 transition-all outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Ödeme Butonu */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-4 font-bold text-black shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] hover:bg-yellow-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> İşleniyor...
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>
    </div>
  );
}
