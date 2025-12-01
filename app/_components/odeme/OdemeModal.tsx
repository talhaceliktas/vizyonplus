"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, CreditCard, Calendar, Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { AbonelikPlani } from "../../types";
import CreditCardVisual from "./CreditCardVisual";
import { createBrowserClient } from "@supabase/ssr";
import { redirect, useRouter } from "next/navigation";

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
    formState: { isSubmitting },
    reset,
  } = useForm<FormData>();
  const watchedValues = watch();
  const router = useRouter();

  // --- KART NUMARASI FORMATLAMA (1234 5678...) ---
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Sadece rakamları al ve boşlukları temizle
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 16);

    // 2. 4'erli gruplara ayır ve aralarına boşluk koy
    const formattedValue = rawValue.match(/.{1,4}/g)?.join(" ") || "";

    // 3. Form değerini güncelle
    setValue("cardNumber", formattedValue);
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
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Oturum süreniz dolmuş, lütfen tekrar giriş yapın.");
        return;
      }

      // Kart numarasındaki boşlukları temizleyerek gönderelim (Backend temiz data ister)
      const cleanData = {
        ...data,
        cardNumber: data.cardNumber.replace(/\s/g, ""),
      };

      const response = await fetch("/api/payment/mock-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          ...cleanData,
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

      router.push("/profil/abonelikler");
    } catch (error) {
      toast.error(error.message || "İşlem sırasında bir hata oluştu.");
      console.error(error);
    }
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md duration-200">
      <div className="bg-primary-900 ring-primary-800 relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl ring-1 md:flex">
        {/* --- SOL TARAFI: Kart Görseli --- */}
        <div className="border-primary-800 from-primary-800/50 to-primary-900 relative flex flex-col items-center justify-center border-b bg-gradient-to-b p-8 md:w-1/2 md:border-r md:border-b-0">
          <div className="mb-8 text-center">
            <h3 className="text-primary-50 text-xl font-bold">Ödeme Özeti</h3>
            <p className="text-primary-400 mt-1 text-sm">
              Paket:{" "}
              <span className="text-secondary-1 font-semibold">
                {selectedPlan.paket_adi}
              </span>
            </p>
            <p className="text-primary-50 mt-2 text-4xl font-black tracking-tighter">
              {selectedPlan.fiyat} ₺
            </p>
          </div>

          <CreditCardVisual
            cardNumber={watchedValues.cardNumber}
            cardName={watchedValues.cardName}
            expiry={watchedValues.expiry}
            cvc={watchedValues.cvc}
            focusedField={focusedField}
          />

          <div className="bg-primary-800 text-primary-400 mt-8 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
            <Lock className="h-3 w-3" />
            <span>256-bit SSL şifreleme ile korunmaktadır</span>
          </div>
        </div>

        {/* --- SAĞ TARAFI: Form Alanı --- */}
        <div className="bg-primary-900 relative p-8 md:w-1/2">
          <button
            onClick={onClose}
            className="text-primary-400 hover:bg-primary-800 hover:text-primary-50 absolute top-4 right-4 rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-primary-50 mb-6 flex items-center gap-2 text-2xl font-bold">
            Kart Bilgileri
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-primary-500 pl-1 text-xs font-bold tracking-wider uppercase">
                Kart Numarası
              </label>
              <div className="group relative">
                <CreditCard className="text-primary-500 group-focus-within:text-secondary-1 absolute top-3.5 left-3 h-5 w-5 transition-colors" />
                <input
                  {...register("cardNumber", {
                    required: "Gerekli",
                    minLength: { value: 19, message: "Eksik" }, // Boşluklarla beraber 19 karakter
                  })}
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19} // 16 rakam + 3 boşluk
                  onChange={handleCardNumberChange}
                  onFocus={() => setFocusedField("cardNumber")}
                  onBlur={() => setFocusedField(null)}
                  className="border-primary-800 bg-primary-800/50 text-primary-50 placeholder-primary-600 focus:border-secondary-1 focus:bg-primary-800 focus:ring-secondary-1 w-full rounded-xl border py-3 pr-4 pl-10 font-mono transition-all focus:ring-1 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-primary-500 pl-1 text-xs font-bold tracking-wider uppercase">
                Kart Sahibi
              </label>
              <input
                {...register("cardName", { required: "Gerekli" })}
                type="text"
                placeholder="AD SOYAD"
                onFocus={() => setFocusedField("cardName")}
                onBlur={() => setFocusedField(null)}
                className="border-primary-800 bg-primary-800/50 text-primary-50 placeholder-primary-600 focus:border-secondary-1 focus:bg-primary-800 focus:ring-secondary-1 w-full rounded-xl border px-4 py-3 uppercase transition-all focus:ring-1 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-primary-500 pl-1 text-xs font-bold tracking-wider uppercase">
                  SKT
                </label>
                <div className="group relative">
                  <Calendar className="text-primary-500 group-focus-within:text-secondary-1 absolute top-3.5 left-3 h-5 w-5 transition-colors" />
                  <input
                    {...register("expiry", { required: "Gerekli" })}
                    type="text"
                    placeholder="AA/YY"
                    maxLength={5}
                    onChange={handleExpiryChange}
                    onFocus={() => setFocusedField("expiry")}
                    onBlur={() => setFocusedField(null)}
                    className="border-primary-800 bg-primary-800/50 text-primary-50 placeholder-primary-600 focus:border-secondary-1 focus:bg-primary-800 focus:ring-secondary-1 w-full rounded-xl border py-3 pr-4 pl-10 font-mono transition-all focus:ring-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-primary-500 pl-1 text-xs font-bold tracking-wider uppercase">
                  CVC
                </label>
                <div className="group relative">
                  <Lock className="text-primary-500 group-focus-within:text-secondary-1 absolute top-3.5 left-3 h-5 w-5 transition-colors" />
                  <input
                    {...register("cvc", { required: "Gerekli", maxLength: 3 })}
                    type="password"
                    placeholder="•••"
                    maxLength={3}
                    onFocus={() => setFocusedField("cvc")}
                    onBlur={() => setFocusedField(null)}
                    className="border-primary-800 bg-primary-800/50 text-primary-50 placeholder-primary-600 focus:border-secondary-1 focus:bg-primary-800 focus:ring-secondary-1 w-full rounded-xl border py-3 pr-4 pl-10 font-mono transition-all focus:ring-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-secondary-2 shadow-secondary-2/20 hover:bg-secondary-1 mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-black shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:grayscale"
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
