"use client";

/**
 * Bu bileşen, kullanıcı genel bilgilerini (Ad Soyad, Cinsiyet) güncellemek için kullanılır.
 * Email alanı salt okunur olarak gösterilir (değiştirilemez).
 * İşlemler `updateProfileAction` sunucu eylemiyle yapılır.
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

import { updateProfileAction } from "@users/actions/user-actions";

interface ProfileDetailsFormProps {
  user: User; // Auth kullanıcısı (Email ve metadata için)
  profile: any; // Profil tablosundan gelen ek bilgiler (Cinsiyet vb.)
}

const ProfileDetailsForm = ({ user, profile }: ProfileDetailsFormProps) => {
  const [loading, setLoading] = useState(false);

  const {
    user_metadata: { display_name },
    email,
  } = user;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    // Server Action'ı çağır
    const result = await updateProfileAction(formData);

    if (result.success) {
      toast.success(
        result.message ?? "Profil bilgileri başarıyla güncellendi.",
      );
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* --- AD SOYAD ALANI --- */}
      <div className="group relative">
        <label
          htmlFor="adSoyad"
          className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
        >
          Ad Soyad
        </label>
        <input
          id="adSoyad"
          name="adSoyad"
          type="text"
          className="border-primary-800 bg-primary-900 text-primary-50 focus:border-secondary-1 focus:bg-primary-800 dark:border-primary-700 w-full rounded-lg border px-4 py-3 transition-all focus:outline-none dark:text-white"
          defaultValue={display_name}
          required
          minLength={3}
        />
      </div>

      {/* --- EMAIL ALANI (Değiştirilemez) --- */}
      <div className="group relative opacity-70">
        <label
          htmlFor="email"
          className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
        >
          Email Adresi
        </label>
        <input
          id="email"
          type="email"
          className="border-primary-800 bg-primary-800/50 text-primary-400 dark:border-primary-700 w-full cursor-not-allowed rounded-lg border px-4 py-3 focus:outline-none"
          defaultValue={email}
          disabled
        />
        <span className="absolute top-9 right-3 text-xs text-red-500/70">
          Değiştirilemez
        </span>
      </div>

      {/* --- CİNSİYET SEÇİMİ --- */}
      <div className="group relative">
        <label
          htmlFor="cinsiyet"
          className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
        >
          Cinsiyet
        </label>
        <div className="relative">
          <select
            id="cinsiyet"
            name="cinsiyet"
            className="border-primary-800 bg-primary-900 text-primary-50 focus:border-secondary-1 focus:bg-primary-800 dark:border-primary-700 w-full appearance-none rounded-lg border px-4 py-3 transition-all focus:outline-none dark:text-white"
            defaultValue={profile?.cinsiyet || ""}
          >
            <option
              className="dark:bg-primary-100 bg-white text-black dark:text-white"
              value=""
            >
              Belirtmemeyi tercih ediyorum
            </option>
            <option
              className="dark:bg-primary-100 bg-white text-black dark:text-white"
              value="erkek"
            >
              Erkek
            </option>
            <option
              className="dark:bg-primary-100 bg-white text-black dark:text-white"
              value="kadin"
            >
              Kadın
            </option>
          </select>
          {/* Özel Tasarım Ok İkonu */}
          <div className="text-primary-500 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* --- KAYDET BUTONU --- */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-secondary-2 hover:bg-secondary-1-2 hover:shadow-secondary-2/20 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-black transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:px-10"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
};

export default ProfileDetailsForm;
