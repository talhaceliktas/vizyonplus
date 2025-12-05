"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { TiWarningOutline } from "react-icons/ti";
import { Loader2 } from "lucide-react";

// Action Import
import { changePasswordAction } from "@/features/users/actions/user-actions";

const ChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    // Server Action Çağrısı
    const result = await changePasswordAction(formData);

    if (result.success) {
      toast.success(result.message ?? "İşlem başarılı!");
      formRef.current?.reset();
    } else {
      toast.error(result.error ?? "Hata oluştu!");
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
            htmlFor="currentPassword"
            className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
          >
            Mevcut Parola
          </label>
          <input
            id="currentPassword"
            name="currentPassword" // Action'da bu isimle karşılıyoruz
            type="password"
            required
            className="border-primary-800 bg-primary-900 text-primary-50 focus:bg-primary-800 dark:border-primary-700 w-full rounded-lg border px-4 py-3 transition-all focus:border-red-500/50 focus:outline-none dark:text-white"
            placeholder="••••••••"
          />
        </div>

        {/* Yeni Parola */}
        <div>
          <label
            htmlFor="newPassword"
            className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
          >
            Yeni Parola
          </label>
          <input
            id="newPassword"
            name="newPassword" // Action'da bu isimle karşılıyoruz
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
            htmlFor="confirmPassword"
            className="text-primary-500 dark:text-primary-400 mb-1 block text-xs font-medium tracking-wider uppercase"
          >
            Yeni Parola (Tekrar)
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword" // Action'da bu isimle karşılıyoruz
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

export default ChangePasswordForm;
