"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "../../_utils/auth";
import toast from "react-hot-toast";

const KayitOl = ({ setGonderilenEmail, setKayitTamamlandi }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // hata yoksa bu fonksiyon calisir
  async function kayitOl(data: {
    email: string;
    parola1: string;
    parola2: string;
  }) {
    const { email, parola1, parola2 } = data;

    if (parola1 !== parola2) {
      toast.error("Girilen parolalar aynı değil!");
      return;
    }

    const veri = await signUp(email, parola1);

    if (veri?.durum === "basarisiz") {
      toast.error(veri.message);
    } else {
      setGonderilenEmail(veri?.message);
      setKayitTamamlandi(true);
    }
  }

  // hataVar fonksiyonu tamamlanicak
  function hataVar() {}

  const [parola1Gizli, setParola1Gizli] = useState(true);
  const [parola2Gizli, setParola2Gizli] = useState(true);

  return (
    <form
      className="border-primary-800/50 backd bg-primary-700/70 flex flex-col items-center gap-y-6 rounded-2xl border-[1px] p-8 shadow-2xl backdrop-blur-sm"
      onSubmit={handleSubmit(kayitOl, hataVar)}
    >
      <h3 className="text-3xl font-semibold">Kayıt Ol</h3>
      <p className="text-primary-50 opacity-75">
        Hoşgeldiniz! Lütfen gerekli alanları doldurunuz.
      </p>

      <div className="mt-4 mb-8 flex w-full flex-col gap-5">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="John Doe"
            className="peer placeholder:text-primary-50/50 border-primary-500/80 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none focus:border-gray-600"
          />
          <FaUser className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300" />
          <span className="bg-primary-50/85 absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 peer-focus:w-full"></span>
        </div>
        <div className="relative w-full">
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            className="peer placeholder:text-primary-50/50 border-primary-500/80 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none focus:border-gray-600"
            {...register("email", { required: "Email gerekli" })}
          />
          <IoMdMail className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300" />
          <span className="bg-primary-50/85 absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 peer-focus:w-full"></span>
        </div>
        <div className="relative w-full">
          <input
            type={parola1Gizli ? "password" : "text"}
            placeholder="Şifre"
            className="peer placeholder:text-primary-50/50 border-primary-500/80 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none focus:border-gray-600"
            {...register("parola1", { required: "Parola gerekli" })}
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

          <span className="bg-primary-50/85 absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 peer-focus:w-full"></span>
        </div>
        <div className="relative w-full">
          <input
            type={parola2Gizli ? "password" : "text"}
            placeholder="Şifreyi doğrula"
            className="peer placeholder:text-primary-50/50 border-primary-500/80 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none focus:border-gray-600"
            {...register("parola2", { required: "Parola gerekli" })}
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
          <span className="bg-primary-50/85 absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 peer-focus:w-full"></span>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-y-2 sm:flex-row sm:gap-y-0">
          <div className="flex gap-x-2">
            <input type="checkbox" className="block" id="beniHatirla" />
            <label htmlFor="beniHatirla">Beni Hatırla</label>
          </div>
          <Link
            href={""}
            className="hover:text-secondary-2 block text-sm duration-300"
          >
            Şifremi Unuttum
          </Link>
        </div>
      </div>

      <div className="w-full text-center">
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 mb-4 w-full cursor-pointer rounded-2xl py-2 font-bold duration-300"
        >
          Kayıt Ol
        </button>
        <button className="bg-primary-50 mb-4 flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-2xl py-2 duration-300">
          <FcGoogle className="text-2xl" />
          <span className="text-primary-700 font-bold">
            Google ile Giriş Yap
          </span>
        </button>
        <button className="hover:text-secondary-1 cursor-pointer text-xs duration-300">
          <Link href="/giris">Zaten bir hesabın var mı? Giriş yap</Link>
        </button>
      </div>
    </form>
  );
};

export default KayitOl;
