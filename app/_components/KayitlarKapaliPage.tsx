"use client";

import Link from "next/link";
import Image from "next/image";
import { FaLock, FaChevronLeft, FaRegEnvelope } from "react-icons/fa";
// Logonun yolunu kendi projene göre ayarla
import vizyonPlusLogo from "../../public/logo.png";

export default function KayitlarKapaliPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black font-sans text-white">
      {/* 1. Arkaplan Efekti (Sinematik Glow) */}
      <div className="bg-primary-600/20 absolute -top-20 -left-20 h-96 w-96 rounded-full blur-[120px]" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      {/* İsteğe bağlı: Arka plana hafif bir poster kolajı koyup üzerine siyah overlay atabilirsin */}
      <div className="absolute inset-0 z-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f85718e0-bc46-4f47-90f8-b7d71e8ba75c/tr-TR-20231113-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>

      {/* 2. Ana Kart */}
      <div className="animate-in fade-in slide-in-from-bottom-8 relative z-10 mx-4 w-full max-w-md duration-700">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center shadow-2xl shadow-black backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            {/* Logo yoksa text kullanabilirsin */}
            {/* <h1 className="text-3xl font-bold text-primary-600">VIZYON+</h1> */}
            <Image
              src={vizyonPlusLogo}
              alt="Vizyon+"
              width={140}
              height={40}
              className="object-contain"
            />
          </div>

          {/* İkon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800/50 ring-1 ring-neutral-700">
            <FaLock className="h-8 w-8 text-neutral-400" />
          </div>

          {/* Başlıklar */}
          <h2 className="mb-3 text-2xl font-bold text-white">
            Kayıtlar Geçici Olarak Kapalı
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-neutral-400">
            Vizyon+ ayrıcalığını ve yayın kalitesini korumak amacıyla şu anda
            yeni üye alımını durdurduk. Sadece davetiye kodu olanlar giriş
            yapabilir.
          </p>

          {/* Bekleme Listesi Formu (Görseldir, backend'e bağlayabilirsin) */}
          <div className="mb-8 rounded-lg bg-neutral-950/50 p-1 ring-1 ring-neutral-800">
            <div className="flex items-center">
              <div className="pl-3 text-neutral-500">
                <FaRegEnvelope />
              </div>
              <input
                type="email"
                placeholder="E-posta adresini bırak, haber verelim."
                className="w-full border-none bg-transparent px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:ring-0 focus:outline-none"
              />
              <button className="bg-primary-600 hover:bg-primary-700 m-1 rounded-md px-4 py-1.5 text-xs font-semibold text-white transition-colors">
                Haber Ver
              </button>
            </div>
          </div>

          {/* Alt Linkler */}
          <div className="flex flex-col gap-y-3 border-t border-neutral-800 pt-6">
            <Link
              href="/giris"
              className="rounded-lg bg-white py-3 text-sm font-bold text-black transition-colors hover:bg-neutral-200"
            >
              Zaten Üye Misin? Giriş Yap
            </Link>

            <Link
              href="/"
              className="group flex items-center justify-center gap-x-2 text-sm font-medium text-neutral-500 transition-colors hover:text-white"
            >
              <FaChevronLeft className="text-xs transition-transform group-hover:-translate-x-1" />
              Anasayfaya Dön
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Vizyon+. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
