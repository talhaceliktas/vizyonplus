"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { registerAction } from "@auth/actions/auth-actions";

type KayitOlProps = {
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<KayitFormu>();

  const [parola1Gizli, setParola1Gizli] = useState(true);
  const [parola2Gizli, setParola2Gizli] = useState(true);

  // Form Submit İşlemi
  async function onSubmit(data: KayitFormu) {
    const { isim, email, parola1 } = data;

    // Server Action çağırıyoruz
    const veri = await registerAction(isim, email, parola1);

    if (veri?.durum === "basarisiz") {
      toast.error(veri.message);
    } else {
      setGonderilenEmail(veri?.message ?? "");
      setKayitTamamlandi(true);
      toast.success("Kayıt işlemi başarılı!");
    }
  }

  const hataVar: SubmitErrorHandler<KayitFormu> = (
    errors: FieldErrors<KayitFormu>,
  ) => {
    if (errors.email) toast.error(errors.email.message ?? "Email hatası");
    if (errors.isim) toast.error(errors.isim.message ?? "İsim hatası");
    if (errors.parola1) toast.error(errors.parola1.message ?? "Parola hatası");
    if (errors.parola2)
      toast.error(errors.parola2.message ?? "Parola tekrar hatası");
  };

  return (
    <form
      className="border-primary-800/50 dark:bg-primary-700/70 bg-primary-900/70 text-primary-100 flex w-full max-w-md flex-col items-center gap-y-4 rounded-2xl border p-8 shadow-2xl backdrop-blur-sm duration-300 md:gap-y-6"
      onSubmit={handleSubmit(onSubmit, hataVar)}
    >
      <h3 className="text-2xl font-semibold md:text-3xl">Kayıt Ol</h3>
      <p className="text-primary-50 text-center opacity-75">
        Hoşgeldiniz! Lütfen gerekli alanları doldurunuz.
      </p>

      <div className="mt-4 mb-4 flex w-full flex-col gap-5 md:mb-8">
        {/* İsim Alanı */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Ad Soyad"
            className="peer placeholder:text-primary-50/50 border-primary-500/80 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none focus:border-gray-600"
            {...register("isim", { required: "İsim boş bırakılamaz" })}
          />
          <FaUser className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300" />
          <span className="bg-primary-50/85 absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full"></span>
        </div>

        {/* Email Alanı */}
        <div className="relative w-full">
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            className={`peer placeholder:text-primary-50/50 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none ${
              errors?.email
                ? "border-red-600/80 focus:border-red-500/80"
                : "border-primary-500/80 focus:border-gray-600"
            }`}
            {...register("email", { required: "Email boş bırakılamaz" })}
          />
          <IoMdMail className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300" />
          <span
            className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors?.email ? "bg-red-500/80" : "bg-primary-50/85"}`}
          ></span>
        </div>

        {/* Parola 1 */}
        <div className="relative w-full">
          <input
            type={parola1Gizli ? "password" : "text"}
            placeholder="Şifre"
            className="peer placeholder:text-primary-50/50 border-primary-500/80 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none focus:border-gray-600"
            {...register("parola1", {
              required: "Parola boş bırakılamaz!",
              minLength: {
                value: 8,
                message: "Girilen şifre 8 karakterden az olamaz",
              },
            })}
          />
          <button
            className="cursor-pointer"
            onClick={() => setParola1Gizli((durum) => !durum)}
            type="button"
          >
            {parola1Gizli ? (
              <FaEyeSlash className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300 hover:fill-amber-100" />
            ) : (
              <FaEye className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300 hover:fill-amber-100" />
            )}
          </button>
          <span className="bg-primary-50/85 absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full"></span>
        </div>

        {/* Parola 2 */}
        <div className="relative w-full">
          <input
            type={parola2Gizli ? "password" : "text"}
            placeholder="Şifreyi doğrula"
            className="peer placeholder:text-primary-50/50 border-primary-500/80 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none focus:border-gray-600"
            {...register("parola2", {
              required: "Parola doğrulama boş bırakılamaz",
              minLength: {
                value: 8,
                message: "Girilen şifre 8 karakterden az olamaz",
              },
              validate: (value) =>
                value === getValues("parola1") ||
                "Girilen şifreler aynı olmalı!",
            })}
          />
          <button
            className="cursor-pointer"
            onClick={() => setParola2Gizli((durum) => !durum)}
            type="button"
          >
            {parola2Gizli ? (
              <FaEyeSlash className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300 hover:fill-amber-100" />
            ) : (
              <FaEye className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300 hover:fill-amber-100" />
            )}
          </button>
          <span className="bg-primary-50/85 absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full"></span>
        </div>

        {/* Ek Linkler */}
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex gap-x-2">
            <input type="checkbox" className="block" id="beniHatirla" />
            <label htmlFor="beniHatirla">Beni Hatırla</label>
          </div>
        </div>
      </div>

      {/* Butonlar */}
      <div className="w-full text-center">
        <button
          type="submit"
          className="dark:bg-primary-500 bg-primary-600 hover:bg-primary-500 dark:hover:bg-primary-400 mb-4 w-full cursor-pointer rounded-2xl py-2 font-bold duration-300"
        >
          Kayıt Ol
        </button>
        <button
          className="bg-primary-900 text-primary-100 hover:bg-primary-800 mb-4 flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-2xl py-2 duration-300"
          type="button"
        >
          <FcGoogle className="text-2xl" />
          <span className="font-bold">Google ile Kayıt Ol</span>
        </button>
        <div className="dark:hover:text-secondary-1 hover:text-secondary-2/80 text-primary-100 cursor-pointer text-base duration-300">
          <Link href="/giris">Zaten bir hesabın var mı? Giriş yap</Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
