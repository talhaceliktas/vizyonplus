"use client";

import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import vizyonPLusLogo from "../../../public/logo.png";
import supabaseBrowserClient from "../../_lib/supabase/client"; // Supabase client yolunu kontrol et
import { User as SupabaseUser } from "@supabase/supabase-js";

type IzleNavbarProps = {
  baslik?: string;
};

const IzleNavbar = ({ baslik }: IzleNavbarProps) => {
  // --- STATE ---
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profilFoto, setProfilFoto] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      // Mevcut oturumu al
      const {
        data: { session },
      } = await supabaseBrowserClient.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // Profil fotoğrafını çek
        const { data, error } = await supabaseBrowserClient
          .from("profiller")
          .select("profil_fotografi")
          .eq("id", currentUser.id)
          .single();

        if (!error && data?.profil_fotografi) {
          setProfilFoto(`${data.profil_fotografi}?t=${Date.now()}`);
        }
      }
    };

    fetchUserAndProfile();
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {/* Arka Plan Gradyanı (Yazıların okunması için) */}
      <div className="pointer-events-none absolute inset-0 h-28 bg-gradient-to-b from-black/90 via-black/60 to-transparent" />

      {/* İçerik Konteynırı */}
      <div className="relative mx-auto flex h-20 w-full items-center justify-between px-6 lg:px-10">
        {/* --- SOL TARAFI: GERİ DÖN & LOGO --- */}
        <div className="z-10 flex items-center gap-6">
          <Link
            href="/"
            className="group flex translate-y-2 items-center justify-center rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
            title="Ana Sayfaya Dön"
          >
            <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
          </Link>

          {/* Logo */}
          <Link
            href="/"
            className="hidden opacity-80 transition-opacity hover:opacity-100 sm:block"
          >
            <Image
              src={vizyonPLusLogo}
              alt="Logo"
              width={100}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* --- ORTA: BAŞLIK (Mutlak Ortalanmış) --- */}
        {baslik && (
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 text-center md:block">
            <h1 className="text-lg font-bold tracking-wide whitespace-nowrap text-white/90 drop-shadow-lg">
              {baslik}
            </h1>
          </div>
        )}

        {/* --- SAĞ TARAFI: PROFİL FOTOĞRAFI --- */}
        <div className="z-10 flex items-center gap-4">
          {/* Profil Çerçevesi */}
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 shadow-md transition-transform hover:scale-105 hover:border-yellow-500">
            {profilFoto ? (
              <Image
                src={profilFoto}
                alt="Profil"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/10 backdrop-blur-sm">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default IzleNavbar;
