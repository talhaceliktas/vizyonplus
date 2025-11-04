"use client";

import Link from "next/link";
import { openSans } from "../../_lib/fontlar";
import { FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";
import { useForm } from "react-hook-form";
import { signIn } from "../../_lib/supabase/auth";
import toast from "react-hot-toast";

interface GirisFormu {
  email: string;
  password: string;
}

const GirisYap = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<GirisFormu>();

  async function girisYap(data: { email: string; password: string }) {
    const { email, password } = data;

    const veri = await signIn(email, password);

    if (veri.durum === "basarisiz") {
      toast.error(veri.message);
    }
  }

  function hataVar() {
    console.log(errors);
  }

  return (
    <div
      className={`text-primary-50 flex h-full w-full flex-col items-center justify-center gap-y-3 bg-cover bg-center p-2 duration-300 md:p-5 ${openSans.className} `}
      style={{ backgroundImage: "url('/loginBG.webp')" }}
    >
      <form
        className="border-primary-800/50 dark:bg-primary-700/70 bg-primary-900/70 flex flex-col items-center gap-y-2 rounded-2xl border-[1px] px-4 py-6 shadow-2xl backdrop-blur-sm md:gap-y-6 md:p-8"
        onSubmit={handleSubmit(girisYap, hataVar)}
      >
        <h3 className="text-2xl font-semibold md:text-3xl">Giriş Yap</h3>
        <p className="text-center text-sm opacity-75 md:text-base">
          Hoşgeldiniz! Lütfen gerekli alanları doldurunuz.
        </p>
        <div className="mt-4 mb-8 flex w-full flex-col gap-5">
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
              type="password"
              placeholder="Şifre"
              className="peer placeholder:text-primary-50/50 border-primary-500/80 w-full border-b-[3px] bg-transparent py-2 transition-all duration-300 outline-none focus:border-gray-600"
              {...register("password", { required: "Sifre gerekli" })}
            />
            <FaLock className="peer-focus:fill-primary-50 fill-primary-300 absolute top-1/2 right-2 -translate-y-1/2 text-xl duration-300" />
            <span className="bg-primary-50/85 absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 peer-focus:w-full"></span>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
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
          <button className="dark:bg-primary-500 bg-primary-600 hover:bg-primary-500 dark:hover:bg-primary-400 mb-4 w-full cursor-pointer rounded-2xl py-2 font-bold duration-300">
            Giriş Yap
          </button>
          <button className="bg-primary-900 text-primary-100 hover:bg-primary-800 mb-4 flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-2xl py-2 duration-300">
            <FcGoogle className="text-2xl" />
            <span className="font-bold">Google ile Giriş Yap</span>
          </button>
          <button className="dark:hover:text-secondary-1 hover:text-secondary-2/80 text-primary-100 cursor-pointer text-base duration-300">
            <Link href="/kayitol">Hemen Kayıt Ol</Link>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GirisYap;
