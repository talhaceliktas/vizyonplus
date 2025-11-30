"use client";

import React, { useState } from "react";
import {
  X,
  CreditCard,
  Calendar,
  Lock,
  Loader2,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { filmiSatinAl } from "../../../_lib/data-service-server"; // Action yolunu kontrol et

type FilmSatinAlmaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  filmId: number;
  filmAdi: string;
  fiyat: number;
};

export default function FilmSatinAlmaModal({
  isOpen,
  onClose,
  filmId,
  filmAdi,
  fiyat,
}: FilmSatinAlmaModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  if (!isOpen) return null;

  // Input Formatlayıcılar
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    val = val.replace(/(\d{4})/g, "$1 ").trim();
    setFormData({ ...formData, cardNumber: val });
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 3) val = val.substring(0, 2) + "/" + val.substring(2);
    setFormData({ ...formData, expiry: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Önce sunucu tarafında satın alma işlemini yap
      // Not: Gerçek senaryoda kart bilgileri Iyzico/Stripe tarafına token olarak gider.
      // Burada mock işlem yapıyoruz.
      const result = await filmiSatinAl(filmId, fiyat);

      if (result.success) {
        toast.success("Ödeme Başarılı! İyi seyirler 🍿");
        router.refresh(); // Sayfayı yenile ki buton "İzle"ye dönsün
        setTimeout(() => {
          onClose(); // Modalı kapat
        }, 1000);
      } else {
        toast.error(result.error || "Ödeme alınamadı.");
      }
    } catch (error) {
      toast.error("Beklenmedik bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200">
      {/* Dış katman kapatma */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* --- KART TASARIMI (AbonelikKarti ile aynı stil) --- */}
      <div className="animate-in zoom-in-95 relative w-full max-w-md duration-200">
        {/* Kapatma Butonu */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 rounded-full bg-white p-2 text-black shadow-lg transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="group relative flex flex-col rounded-3xl border-2 border-yellow-500 bg-white p-8 shadow-xl shadow-yellow-500/20 dark:border-yellow-500/50 dark:bg-gray-900 dark:shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)]">
          {/* Rozet */}
          <div className="absolute -top-4 right-0 left-0 mx-auto w-max">
            <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-4 py-1 text-xs font-bold text-black shadow-lg">
              <Lock className="h-3 w-3" /> GÜVENLİ ÖDEME
            </span>
          </div>

          {/* Film Bilgisi & Fiyat */}
          <div className="mb-6 text-center">
            <h3 className="mb-1 text-lg font-medium text-gray-500 dark:text-gray-400">
              {filmAdi}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                {fiyat} ₺
              </span>
              <span className="rounded-lg bg-yellow-500/10 px-2 py-1 text-sm font-bold text-yellow-600 dark:text-yellow-500">
                Tek Seferlik
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />

          {/* --- KREDİ KARTI FORMU --- */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kart Numarası */}
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Kart Numarası
              </label>
              <div className="relative">
                <CreditCard className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                  value={formData.cardNumber}
                  onChange={handleCardNumber}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 font-mono text-sm font-medium text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>

            {/* Kart Sahibi */}
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Kart Üzerindeki İsim
              </label>
              <input
                type="text"
                placeholder="AD SOYAD"
                required
                value={formData.cardName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cardName: e.target.value.toUpperCase(),
                  })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SKT */}
              <div className="space-y-1">
                <label className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  SKT (Ay/Yıl)
                </label>
                <div className="relative">
                  <Calendar className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="AA/YY"
                    maxLength={5}
                    required
                    value={formData.expiry}
                    onChange={handleExpiry}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 font-mono text-sm font-medium text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
              </div>

              {/* CVC */}
              <div className="space-y-1">
                <label className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  CVC / CVV
                </label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="•••"
                    maxLength={3}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 font-mono text-sm font-medium text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Ödeme Butonu */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full rounded-xl bg-yellow-500 py-4 text-sm font-bold text-black shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] hover:bg-yellow-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Ödeme İşleniyor...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{fiyat} ₺ Öde ve İzle</span>
                </div>
              )}
            </button>
          </form>

          {/* Alt Bilgi */}
          <div className="mt-4 flex justify-center gap-2 text-gray-400 opacity-50 grayscale dark:invert">
            {/* Buraya VISA / Mastercard logoları imaj olarak gelebilir */}
            <span className="text-[10px] font-bold">VISA</span>
            <span className="text-[10px] font-bold">MasterCard</span>
            <span className="text-[10px] font-bold">TROY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
