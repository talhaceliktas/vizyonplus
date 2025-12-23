"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { registerAction } from "@auth/actions/auth-actions";
import { FormInput } from "@shared/components/ui/FormInput";

// BU DOSYA NE İŞE YARAR?
// Kullanıcı kayıt formunu yöneten Client Component.
// Şifre eşleşme kontrolü ve kayıt işlemi burada yapılır.

type KayitOlProps = {
  // State Set Fonksiyonlarının Tipleri
  // Üst bileşenden (page.tsx veya Wrapper) gelen fonksiyonlar.
  setGonderilenEmail: React.Dispatch<React.SetStateAction<string>>;
  setKayitTamamlandi: React.Dispatch<React.SetStateAction<boolean>>;
};

interface KayitFormu {
  isim: string;
  email: string;
  parola1: string;
  parola2: string;
}

const RegisterForm = ({
  setGonderilenEmail,
  setKayitTamamlandi,
}: KayitOlProps) => {
  // useForm Hook
  const {
    register,
    handleSubmit,
    // isSubmitting: Form gönderilirken otomatik true olur, bitince false.
    // Loading state için ekstra useState kullanmaya gerek kalmaz.
    formState: { errors, isSubmitting },
    getValues, // Anlık form değerlerini okumak için (Şifre tekrarı kontrolü)
  } = useForm<KayitFormu>();

  async function onSubmit(data: KayitFormu) {
    const { isim, email, parola1 } = data;

    // Server Action Çağrısı
    const veri = await registerAction(isim, email, parola1);

    if (veri?.durum === "basarisiz") {
      toast.error(veri.message);
    } else {
      // Başarılı olursa üst bileşenin state'ini güncelle
      setGonderilenEmail(veri?.message ?? "");
      setKayitTamamlandi(true);
      toast.success("Kayıt işlemi başarılı!");
    }
  }

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <form
        className="dark:bg-primary-950/80 dark:border-primary-800 relative flex w-full max-w-md flex-col gap-y-6 rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300 md:p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Başlık */}
        <div className="space-y-2 text-center">
          <h3 className="text-primary-200 dark:text-primary-50 /* Dark: Beyaz */ text-3xl font-bold tracking-tight md:text-4xl">
            Kayıt Ol
          </h3>
          <p className="text-primary-500 dark:text-primary-400 /* Dark: Açık Gri */ text-sm font-medium">
            Aramıza katılmak için bilgilerinizi girin.
          </p>
        </div>

        {/* Inputlar */}
        <div className="flex flex-col gap-4">
          <FormInput
            type="text"
            placeholder="Ad Soyad"
            icon={FaUser}
            error={errors.isim?.message}
            registration={register("isim", { required: "İsim gereklidir" })}
          />

          <FormInput
            type="email"
            placeholder="E-posta Adresi"
            icon={IoMdMail}
            error={errors.email?.message}
            registration={register("email", { required: "Email gereklidir" })}
          />

          <FormInput
            type="password"
            placeholder="Parola"
            error={errors.parola1?.message}
            registration={register("parola1", {
              required: "Parola gereklidir",
              minLength: {
                value: 8,
                message: "En az 8 karakter olmalı",
              },
            })}
          />

          <FormInput
            type="password"
            placeholder="Parolayı Doğrula"
            error={errors.parola2?.message}
            registration={register("parola2", {
              required: "Doğrulama gereklidir",
              // Şifre tekrar kontrolü
              validate: (val) =>
                val === getValues("parola1") || "Şifreler eşleşmiyor",
            })}
          />
        </div>

        {/* Butonlar */}
        <div className="space-y-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            // Secondary rengi genellikle hem dark hem light'ta iyi durur ama yazı rengini garantiye aldım
            className="bg-secondary-1-2 shadow-secondary-1/20 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "İşleniyor..." : "Hesap Oluştur"}
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
            className="border-primary-200 text-primary-200 hover:bg-primary-900 dark:border-primary-700 dark:bg-primary-900/50 dark:text-primary-100 dark:hover:bg-primary-800 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border bg-white py-3.5 text-sm font-medium transition-all active:scale-[0.98]"
          >
            <FcGoogle className="text-xl" />
            <span>Google ile devam et</span>
          </button>
        </div>

        {/* Alt Link */}
        <div className="text-primary-500 dark:text-primary-400 text-center text-sm">
          Zaten hesabın var mı?{" "}
          <Link
            href="/giris"
            className="text-secondary-1 hover:text-secondary-1-2 font-bold transition-all hover:underline"
          >
            Giriş Yap
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
