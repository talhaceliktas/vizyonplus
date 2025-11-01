import { User } from "@supabase/supabase-js";
import { TiWarningOutline } from "react-icons/ti";

const SifreDegistir = ({ user }: { user: User }) => {
  return (
    <div className="w-full max-w-lg py-10 text-lg md:text-xl">
      <p className="text-sm text-red-800 flex items-center justify-center gap-2 py-2"> <TiWarningOutline className="text-6xl"/> Lütfen mevcut şifrenizi girin ve yeni bir şifre belirleyin. Güvenliğiniz için şifreniz en az 8 karakter olmalı.</p>
      <div className="grid grid-cols-[150px_1fr] items-center gap-x-6 gap-y-4">        
        <label htmlFor="adSoyad" className="text-gray-300">
          Mevcut Parola:
        </label>
        <input
          id="mevcutParola"
          type="password"
          className="bg-primary-700 w-full rounded-md px-3 py-2 text-xl text-white outline-none"
        />

        <label htmlFor="email" className="text-gray-300">
          Yeni Parola:
        </label>
        <input
          id="yeniParola"
          type="password"
          className="bg-primary-700 w-full rounded-md px-3 py-2 text-xl text-white outline-none"
        />

        <label htmlFor="email" className="text-gray-300">
          Yeni Parola Doğrula:
        </label>
        <input
          id="yeniParolaDogrula"
          type="password"
          className="bg-primary-700 w-full rounded-md px-3 py-2 text-xl text-white outline-none"
        />
      </div>
      <button className="bg-secondary-1 hover:bg-secondary-1-2 mt-4 ml-auto block cursor-pointer rounded-md px-2 py-1 text-lg text-black duration-300">
        Şifreyi Güncelle
      </button>
    </div>
  );
};

export default SifreDegistir;
