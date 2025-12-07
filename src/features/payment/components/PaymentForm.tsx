"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CreditCard, Calendar, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
// Önceki adımda oluşturduğumuz action'ı buradan çağırıyoruz
import { createMockSubscription } from "@/features/payment/services/payment-actions";

interface PaymentFormProps {
  planId: number;
}

export default function PaymentForm({ planId }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Yapay gecikme (Kart işleniyor hissi vermek için)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 2. Server Action ile aboneliği başlat (Mock)
      const res = await createMockSubscription(planId);

      if (res.success) {
        toast.success("Ödeme başarılı! Aboneliğiniz başlatıldı. 🎉");
        router.push("/profil"); // Başarılı işlem sonrası profil sayfasına yönlendir
      } else {
        toast.error(res.error || "Ödeme sırasında bir hata oluştu.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
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
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pr-4 pl-12 text-white placeholder-gray-600 transition-all outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              required
            />
          </div>
        </div>

        {/* 3. Son Kullanma Tarihi ve CVC (Yan Yana) */}
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
                placeholder="AA/YY"
                maxLength={5}
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
                placeholder="123"
                maxLength={3}
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pr-4 pl-12 text-white placeholder-gray-600 transition-all outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Ödeme Butonu */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-4 font-bold text-black shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] hover:bg-yellow-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> İşleniyor...
            </>
          ) : (
            "Ödemeyi Tamamla"
          )}
        </button>
      </form>
    </div>
  );
}
