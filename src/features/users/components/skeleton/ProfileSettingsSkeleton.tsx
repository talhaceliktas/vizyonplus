/**
 * Bu bileşen, Profil Ayarları sayfasının yüklenme durumunda gösterilen iskelet (skeleton) yapısıdır.
 * Form inputları ve kart yapısını taklit ederek kullanıcıya yükleniyor hissi verir.
 */

import React from "react";
import Skeleton from "@shared/components/ui/Skeleton";

export default function ProfileSettingsSkeleton() {
  return (
    <div className="flex-1 animate-pulse space-y-10">
      {/* --- KART 1: PROFİL BİLGİLERİ SKELETON --- */}
      <div className="bg-primary-900 border-primary-800 rounded-2xl border p-6 shadow-xl md:p-10">
        {/* Başlık Skeleton */}
        <div className="border-primary-800 mb-8 border-b pb-4">
          <Skeleton className="h-8 w-48 rounded-md" />
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* Avatar Alanı Skeleton */}
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full md:h-40 md:w-40" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>

          {/* Form Alanı Skeleton */}
          <div className="w-full flex-1 space-y-6">
            {/* Ad Soyad Input */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded" /> {/* Label */}
              <Skeleton className="h-12 w-full rounded-lg" /> {/* Input */}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded" /> {/* Label */}
              <Skeleton className="h-12 w-full rounded-lg opacity-70" />{" "}
              {/* Input (Disabled hissi) */}
            </div>

            {/* Cinsiyet Select */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded" /> {/* Label */}
              <Skeleton className="h-12 w-full rounded-lg" /> {/* Select */}
            </div>

            {/* Kaydet Butonu */}
            <div className="pt-4">
              <Skeleton className="h-12 w-full rounded-xl md:w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* --- KART 2: GÜVENLİK SKELETON --- */}
      <div className="bg-primary-900 border-primary-800 rounded-2xl border p-6 shadow-xl md:p-10">
        {/* Başlık Skeleton */}
        <div className="border-primary-800 mb-8 border-b pb-4">
          <Skeleton className="h-8 w-40 rounded-md" />
        </div>

        {/* Uyarı Kutusu Skeleton */}
        <Skeleton className="mb-8 h-20 w-full rounded-xl" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Mevcut Parola */}
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Yeni Parola */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Yeni Parola Tekrar */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Buton Skeleton */}
        <div className="mt-8 flex justify-end">
          <Skeleton className="h-12 w-full rounded-xl md:w-40" />
        </div>
      </div>
    </div>
  );
}
