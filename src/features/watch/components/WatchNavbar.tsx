/**
 * Bu bileşen, izleme sayfasında (Player Üzerinde) görünen gezinme çubuğudur.
 * Fare hareketine göre (mousemove) otomatik olarak görünür veya gizlenir.
 * "Geri Dön" butonu ve kullanıcı profilini içerir.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import supabaseBrowserClient from "@/lib/supabase/client";
import vizyonPlusLogo from "@public/logo.png";

interface WatchNavbarProps {
  title?: string;
}

export default function WatchNavbar({ title }: WatchNavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Profil Fotosunu Çek
  // Not: Client-side fetch yapıyoruz çünkü Navbar bir Client Component ve session bilgisine tarayıcıdan erişiyor.
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabaseBrowserClient.auth.getSession();
      if (!session?.user) return;

      const { data } = await supabaseBrowserClient
        .from("profiller")
        .select("profil_fotografi")
        .eq("id", session.user.id)
        .single();

      if (data?.profil_fotografi) {
        setAvatarUrl(data.profil_fotografi);
      }
    };
    fetchProfile();
  }, []);

  // Mouse Hareketiyle Gösterme/Gizleme Mantığı
  useEffect(() => {
    const handleActivity = () => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // 2 saniye hareketsizlikten sonra navbar'ı gizle
      timeoutRef.current = setTimeout(() => setIsVisible(false), 2000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("click", handleActivity);

    // Initial trigger
    handleActivity();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("click", handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {/* Okunabilirlik için Gradient Backdrop */}
      <div className="pointer-events-none absolute inset-0 h-32 bg-linear-to-b from-black/90 via-black/50 to-transparent" />

      <div className="relative flex h-20 items-center justify-between px-6 lg:px-8">
        {/* SOL: Geri Dön & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center rounded-full bg-white/10 p-3 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
            aria-label="Geri Dön"
          >
            <ArrowLeft className="h-6 w-6 text-white transition-transform group-hover:-translate-x-1" />
          </button>

          <Link
            href="/"
            className="hidden opacity-80 transition-opacity hover:opacity-100 sm:block"
          >
            <Image
              src={vizyonPlusLogo}
              alt="Vizyon+"
              width={100}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* ORTA: Başlık (Sadece desktopta göster) */}
        {title && (
          <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <h1 className="text-lg font-bold tracking-wide text-gray-200 drop-shadow-md">
              {title}
            </h1>
          </div>
        )}

        {/* SAĞ: Profil */}
        <div className="flex items-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 shadow-lg">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profil"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-800">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
