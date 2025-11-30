"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, CreditCard, Calendar, Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { AbonelikPlani } from "../../types"; // Types yolunu kendine göre ayarla
import CreditCardVisual from "./CreditCardVisual";
import { createBrowserClient } from "@supabase/ssr";

interface OdemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: AbonelikPlani | null;
  onSuccess: () => void;
}

type FormData = {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
};

const OdemeModal: React.FC<OdemeModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onSuccess,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  const watchedValues = watch();

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    setValue("cardNumber", val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setValue("expiry", val);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedPlan) return;

    try {
      // 1. Önce kullanıcının token'ını alalım (Backend artık bunu istiyor!)
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Oturum süreniz dolmuş, lütfen tekrar giriş yapın.");
        return;
      }

      // 2. Form verilerini (data) ve planId'yi birleştirip gönderiyoruz
      const response = await fetch("/api/payment/mock-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // Token'ı buraya ekledik
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ödeme başarısız");
      }

      toast.success("Ödeme Başarılı! Yönlendiriliyorsunuz...", {
        style: { background: "#333", color: "#fff", border: "1px solid #333" },
        iconTheme: { primary: "#EAB308", secondary: "#FFFAEE" },
        duration: 2000,
      });

      setTimeout(() => {
        onSuccess();
        reset();
        onClose();
      }, 1500);
    } catch (error) {
      toast.error(error.message || "İşlem sırasında bir hata oluştu.");
      console.error(error);
    }
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-all duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#0F0F0F] shadow-2xl ring-1 ring-white/10 md:flex">
        {/* --- SOL TARAFI: Kart Görseli --- */}
        <div className="relative flex flex-col items-center justify-center border-b border-white/5 bg-gradient-to-b from-[#151515] to-[#0a0a0a] p-8 md:w-1/2 md:border-r md:border-b-0">
          <div className="mb-8 text-center">
            <h3 className="text-xl font-bold text-white">Ödeme Özeti</h3>
            <p className="mt-1 text-sm text-gray-400">
              Paket:{" "}
              <span className="font-semibold text-yellow-500">
                {selectedPlan.paket_adi}
              </span>
            </p>
            <p className="mt-2 text-4xl font-black tracking-tighter text-white">
              {selectedPlan.fiyat} ₺
            </p>
          </div>

          <CreditCardVisual
            cardNumber={watchedValues.cardNumber}
            cardName={watchedValues.cardName}
            expiry={watchedValues.expiry}
            focusedField={focusedField}
          />

          <div className="mt-8 flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-500">
            <Lock className="h-3 w-3" />
            <span>256-bit SSL şifreleme ile korunmaktadır</span>
          </div>
        </div>

        {/* --- SAĞ TARAFI: Form Alanı --- */}
        <div className="relative bg-[#0F0F0F] p-8 md:w-1/2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
            Kart Bilgileri
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="pl-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                Kart Numarası
              </label>
              <div className="group relative">
                <CreditCard className="absolute top-3.5 left-3 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-yellow-500" />
                <input
                  {...register("cardNumber", {
                    required: "Gerekli",
                    minLength: { value: 16, message: "Eksik" },
                  })}
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  onChange={handleCardNumberChange}
                  onFocus={() => setFocusedField("cardNumber")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-4 pl-10 font-mono text-white placeholder-gray-600 transition-all focus:border-yellow-500/50 focus:bg-white/10 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="pl-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                Kart Sahibi
              </label>
              <input
                {...register("cardName", { required: "Gerekli" })}
                type="text"
                placeholder="AD SOYAD"
                onFocus={() => setFocusedField("cardName")}
                onBlur={() => setFocusedField(null)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white uppercase placeholder-gray-600 transition-all focus:border-yellow-500/50 focus:bg-white/10 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="pl-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  SKT
                </label>
                <div className="group relative">
                  <Calendar className="absolute top-3.5 left-3 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-yellow-500" />
                  <input
                    {...register("expiry", { required: "Gerekli" })}
                    type="text"
                    placeholder="AA/YY"
                    maxLength={5}
                    onChange={handleExpiryChange}
                    onFocus={() => setFocusedField("expiry")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-4 pl-10 font-mono text-white placeholder-gray-600 transition-all focus:border-yellow-500/50 focus:bg-white/10 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="pl-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  CVC
                </label>
                <div className="group relative">
                  <Lock className="absolute top-3.5 left-3 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-yellow-500" />
                  <input
                    {...register("cvc", { required: "Gerekli", maxLength: 3 })}
                    type="password"
                    placeholder="•••"
                    maxLength={3}
                    onFocus={() => setFocusedField("cvc")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-4 pl-10 font-mono text-white placeholder-gray-600 transition-all focus:border-yellow-500/50 focus:bg-white/10 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 py-4 font-bold text-black shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02] hover:from-yellow-400 hover:to-yellow-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:grayscale"
            >
              {isSubmitting ? (
                <BeatLoader size={8} color="#000" />
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Ödemeyi Tamamla</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OdemeModal;
