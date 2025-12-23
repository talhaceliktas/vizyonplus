"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// İkonlar
import { FaLock } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";

// Action ve Bileşenler
import { loginAction } from "@/features/auth/actions/auth-actions";
import { FormInput } from "@shared/components/ui/FormInput";

// BU DOSYA NE İŞE YARAR?
// Kullanıcı giriş formunu yöneten Client Component'tir.
// Form validasyonu, hata gösterimi ve sunucu ile iletişim (Server Action) burada yapılır.

// Neden "use client"?
// Bu bileşen kullanıcının tarayıcısında çalışır (interaktiflik, useState, onClick vb. içerir).
// Bu yüzden "use client" direktifi zorunludur.

export interface LoginFormInputs {
  email: string;
  sifre: string;
}

const LoginForm = () => {
  // HOOK KULLANIMLARI
  // useRouter: Sayfa yönlendirmesi yapmak için (Giriş başarılıysa profil sayfasına git).
  const router = useRouter();

  // useState: Yükleniyor durumunu tutmak için. (Butonu disable etmek vs.)
  const [isLoading, setIsLoading] = useState(false);

  // useForm: React Hook Form kütüphanesi.
  // Form işlemlerini (state yönetimi, validasyon, hata takibi) çok kolaylaştırır.
  const {
    register, // Inputları forma kaydetmek için
    handleSubmit, // Form gönderildiğinde çalışacak fonksiyonu sarmalar
    formState: { errors }, // Hata mesajlarını tutan obje
  } = useForm<LoginFormInputs>();

  // FORM GÖNDERME FONKSİYONU
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    try {
      // SERVER ACTION ÇAĞRISI
      // Sunucu tarafındaki (src/features/auth/actions/auth-actions.ts) fonksiyonu çağırır.
      // E-posta ve şifreyi sunucuya gönderir.
      const result = await loginAction(data);

      if (!result.success) {
        // HATA DURUMU
        toast.error(result.error ?? "Giriş başarısız.");
        setIsLoading(false);
      } else {
        // BAŞARILI DURUM
        toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");

        // Yönlendirme (biraz bekleyip efektin görülmesini sağlıyoruz)
        setTimeout(() => {
          window.location.href = "/profil"; // window.location full refresh yapar, bazen auth cookie'lerin oturması için daha garantidir.
        }, 1000);
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <form
        className="dark:bg-primary-950/80 dark:border-primary-800 relative flex w-full max-w-md flex-col gap-y-6 rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300 md:p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Başlık Alanı */}
        <div className="space-y-2 text-center">
          <h3 className="text-primary-200 text-3xl font-bold tracking-tight md:text-4xl">
            Hoş Geldiniz
          </h3>
          <p className="text-primary-500 dark:text-primary-400 text-sm font-medium">
            Devam etmek için lütfen giriş yapın.
          </p>
        </div>

        {/* Inputlar */}
        <div className="mt-4 flex flex-col gap-4">
          <FormInput
            type="email"
            placeholder="E-posta Adresi"
            icon={IoMdMail}
            error={errors.email?.message}
            // REGISTER FONKSİYONU
            // Inputu hook form'a tanıtır ve validasyon kurallarını belirler.
            registration={register("email", {
              required: "E-posta adresi gereklidir",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Geçersiz e-posta adresi",
              },
            })}
          />

          <FormInput
            type="password"
            placeholder="Şifre"
            icon={FaLock}
            error={errors.sifre?.message}
            registration={register("sifre", {
              required: "Şifre gereklidir",
              minLength: { value: 6, message: "Şifre en az 6 karakter olmalı" },
            })}
          />
        </div>

        {/* Şifremi Unuttum Linki - Sağ tarafa yaslı */}
        <div className="flex justify-end">
          <Link
            href="/sifremi-unuttum"
            className="text-primary-500 hover:text-secondary-1 dark:text-primary-400 dark:hover:text-secondary-1 text-sm font-semibold transition-colors"
          >
            Şifremi unuttum?
          </Link>
        </div>

        {/* Butonlar */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-secondary-1 shadow-secondary-1/20 hover:bg-secondary-1-2 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>

          <div className="relative flex items-center py-1">
            <div className="border-primary-200 dark:border-primary-700 grow border-t"></div>
            <span className="text-primary-400 dark:text-primary-500 mx-4 text-xs font-medium">
              YA DA
            </span>
            <div className="border-primary-200 dark:border-primary-700 grow border-t"></div>
          </div>

          <button
            type="button"
            className="border-primary-200 text-primary-200 bg-primary-900 dark:border-primary-700 dark:text-primary-200 hover:bg-primary-800 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border py-3.5 text-sm font-medium transition-all active:scale-[0.98]"
          >
            <FcGoogle className="text-xl" />
            <span>Google ile devam et</span>
          </button>
        </div>

        {/* Alt Link */}
        <div className="text-primary-500 dark:text-primary-400 text-center text-sm">
          Hesabın yok mu?{" "}
          <Link
            href="/kayitol"
            className="text-secondary-1 hover:text-secondary-1-2 font-bold transition-all hover:underline"
          >
            Hemen Kayıt Ol
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
