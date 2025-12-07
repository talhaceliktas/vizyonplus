"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// İkonlar
import { FaLock } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";

// Action ve Bileşenler
import { loginAction } from "@/features/auth/actions/auth-actions";
import { FormInput } from "@shared/components/ui/FormInput";

export interface LoginFormInputs {
  email: string;
  sifre: string;
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

    try {
      const result = await loginAction(data);

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
        router.refresh();
        router.push("/profil");
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <form
        className="/* --- LIGHT MODE --- */ /* --- DARK MODE --- */ dark:bg-primary-950/80 dark:border-primary-800 relative flex w-full max-w-md flex-col gap-y-6 rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300 md:p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Başlık Alanı */}
        <div className="space-y-2 text-center">
          <h3 className="text-primary-900 /* Light */ dark:text-primary-50 /* Dark */ text-3xl font-bold tracking-tight md:text-4xl">
            Hoş Geldiniz
          </h3>
          <p className="text-primary-500 /* Light */ dark:text-primary-400 /* Dark */ text-sm font-medium">
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
            className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-900/50 dark:text-primary-200 dark:hover:bg-primary-800 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border bg-white py-3.5 text-sm font-medium transition-all active:scale-[0.98]"
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
