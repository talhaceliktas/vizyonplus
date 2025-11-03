import { User } from "@supabase/supabase-js";
import { TiWarningOutline } from "react-icons/ti";

const SifreDegistir = ({ user }: { user: User }) => {
  return (
    <div className="text-primary-50 w-full max-w-lg px-3 py-6 text-base md:py-10 md:text-lg">
      <p className="mb-4 flex flex-col items-center justify-center gap-2 py-2 text-center text-sm text-red-800 md:flex-row md:text-left dark:text-red-600">
        {" "}
        <TiWarningOutline className="shrink-0 text-4xl md:text-5xl" /> Lütfen
        mevcut şifrenizi girin ve yeni bir şifre belirleyin. Güvenliğiniz için
        şifreniz en az 8 karakter olmalı.
      </p>
      <div className="grid grid-cols-1 items-start gap-x-0 gap-y-2 md:grid-cols-[150px_1fr] md:items-center md:gap-x-6 md:gap-y-4">
        <label htmlFor="mevcutParola">Mevcut Parola:</label>
        <input
          id="mevcutParola"
          type="password"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-base text-white outline-none md:text-lg"
        />

        <label htmlFor="yeniParola">Yeni Parola:</label>
        <input
          id="yeniParola"
          type="password"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-base text-white outline-none md:text-lg"
        />

        <label htmlFor="yeniParolaDogrula">Yeni Parola Doğrula:</label>
        <input
          id="yeniParolaDogrula"
          type="password"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-base text-white outline-none md:text-lg"
        />
      </div>
      <button className="dark:bg-secondary-1 bg-secondary-2 dark:hover:bg-secondary-2 hover:bg-secondary-1-2 mt-6 block w-full cursor-pointer rounded-md px-4 py-2 text-base text-black duration-300 md:mt-4 md:ml-auto md:w-auto md:px-2 md:py-1 md:text-lg">
        Şifreyi Güncelle
      </button>
    </div>
  );
};

export default SifreDegistir;
