"use client";

import { TiWarningOutline } from "react-icons/ti";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { sifreyiGuncelle } from "../../_lib/data-service-server";
import { Loader2 } from "lucide-react";

const SifreDegistir = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await sifreyiGuncelle(formData);

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset(); // Formu temizle
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      {/* Uyarı Kutusu */}
      <div className="mb-8 flex items-start gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
        <TiWarningOutline className="shrink-0 text-2xl" />
        <p className="text-sm leading-relaxed">
          Güvenliğiniz için şifreniz en az 8 karakter olmalı. Şifre
          değişikliğinden sonra oturumunuz açık kalmaya devam edecektir.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mevcut Parola */}
        <div className="md:col-span-2">
          <label
            htmlFor="mevcutParola"
            className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
          >
            Mevcut Parola
          </label>
          <input
            id="mevcutParola"
            name="mevcutParola"
            type="password"
            required
            className="border-primary-800 bg-primary-900 text-primary-50 focus:bg-primary-800 dark:border-primary-700 w-full rounded-lg border px-4 py-3 transition-all focus:border-red-500/50 focus:outline-none dark:text-white"
            placeholder="••••••••"
          />
        </div>

        {/* Yeni Parola */}
        <div>
          <label
            htmlFor="yeniParola"
            className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
          >
            Yeni Parola
          </label>
          <input
            id="yeniParola"
            name="yeniParola"
            type="password"
            required
            minLength={8}
            className="border-primary-800 bg-primary-900 text-primary-50 focus:border-secondary-1 focus:bg-primary-800 dark:border-primary-700 w-full rounded-lg border px-4 py-3 transition-all focus:outline-none dark:text-white"
            placeholder="En az 8 karakter"
          />
        </div>

        {/* Yeni Parola Tekrar */}
        <div>
          <label
            htmlFor="yeniParolaDogrula"
            className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
          >
            Yeni Parola (Tekrar)
          </label>
          <input
            id="yeniParolaDogrula"
            name="yeniParolaDogrula"
            type="password"
            required
            minLength={8}
            className="border-primary-800 bg-primary-900 text-primary-50 focus:border-secondary-1 focus:bg-primary-800 dark:border-primary-700 w-full rounded-lg border px-4 py-3 transition-all focus:outline-none dark:text-white"
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Buton */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:px-10"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </div>
    </form>
  );
};

export default SifreDegistir;
