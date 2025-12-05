"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// İkonlar
import { FaLock, FaGoogle } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

// Action ve Tipler
import { loginAction } from "@/features/auth/actions/auth-actions";

// Eğer types klasörünü henüz oluşturmadıysan tipi buraya da yazabilirsin:
export interface LoginFormInputs {
  email: string;
  sifre: string;
  beniHatirla: boolean;
}

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    // Server Action çağrısı
    const result = await loginAction(data);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    } else {
      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
      router.refresh(); // Cache'i temizle
      router.push("/profil"); // Yönlendir (Middleware zaten yakalar ama garanti olsun)
    }
  };

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-cover bg-center p-4 md:p-12"
      style={{ backgroundImage: "url('/loginBG.webp')" }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/60 px-8 py-10 shadow-2xl backdrop-blur-md">
        {/* Başlık */}
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-white">Giriş Yap</h3>
          <p className="mt-2 text-sm text-gray-300">
            Hoşgeldiniz! Lütfen bilgilerinizi giriniz.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="E-posta Adresi"
              className={`peer w-full border-b-2 border-gray-500 bg-transparent py-2.5 pr-10 pl-2 text-white placeholder-transparent transition-all focus:border-white focus:outline-none ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "E-posta adresi gereklidir",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Geçersiz e-posta adresi",
                },
              })}
            />
            <label className="absolute -top-3.5 left-2 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-white">
              E-posta Adresi
            </label>
            <IoMdMail className="absolute top-3 right-2 text-xl text-gray-400" />
            {errors.email && (
              <span className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Şifre Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="Şifre"
              className={`peer w-full border-b-2 border-gray-500 bg-transparent py-2.5 pr-10 pl-2 text-white placeholder-transparent transition-all focus:border-white focus:outline-none ${
                errors.sifre ? "border-red-500" : ""
              }`}
              {...register("sifre", {
                required: "Şifre gereklidir",
                minLength: { value: 6, message: "En az 6 karakter olmalı" },
              })}
            />
            <label className="absolute -top-3.5 left-2 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-white">
              Şifre
            </label>
            <FaLock className="absolute top-3 right-2 text-lg text-gray-400" />
            {errors.sifre && (
              <span className="mt-1 text-xs text-red-500">
                {errors.sifre.message}
              </span>
            )}
          </div>

          {/* Alt Seçenekler */}
          <div className="flex items-center justify-between text-sm text-gray-300">
            <label className="flex cursor-pointer items-center gap-2 hover:text-white">
              <input
                type="checkbox"
                className="checked:bg-primary-600 rounded border-gray-600 bg-transparent focus:ring-0"
                {...register("beniHatirla")}
              />
              Beni Hatırla
            </label>
            <Link
              href="/sifremi-unuttum"
              className="hover:text-primary-400 transition-colors"
            >
              Şifremi Unuttum
            </Link>
          </div>

          {/* Butonlar */}
          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/30 w-full rounded-xl py-3 font-bold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-gray-900 transition-all hover:bg-gray-100"
            >
              <FaGoogle className="text-xl text-red-600" />
              <span>Google ile Devam Et</span>
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Hesabın yok mu?{" "}
          <Link
            href="/kayitol"
            className="hover:text-primary-400 font-semibold text-white transition-colors"
          >
            Hemen Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
