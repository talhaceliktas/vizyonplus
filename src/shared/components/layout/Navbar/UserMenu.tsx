"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { User } from "@supabase/supabase-js";
import supabaseBrowserClient from "@/lib/supabase/client";
import ProfileDropdown from "./ProfileDropdown";
import useClickOutside from "@hooks/useClickOutside";

// BU DOSYA NE İŞE YARAR?
// Kullanıcı profil menüsü (Avatar).
// Giriş yapmışsa avatarını gösterir, tıklayınca menü açar.
// Profil fotoğrafı değişirse CANLI olarak güncellenir (Realtime).

export const UserMenu = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profilFoto, setProfilFoto] = useState<string | null>(null);

  // Menünün açık/kapalı durumunu yöneten hook için referans
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useClickOutside(dropdownRef);

  // 1. AUTH DURUMUNU DİNLE
  // Kullanıcı giriş/çıkış yaptığında otomatik tetiklenir.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsOpen(false); // Çıkış yapınca menüyü kapat
    });
    return () => subscription.unsubscribe();
  }, [setIsOpen]);

  // 2. PROFİL FOTOĞRAFINI ÇEK VE DİNLE
  useEffect(() => {
    if (!user) return;

    // İlk yüklemede fotoğrafı getir
    const fetchProfilePhoto = async () => {
      const { data } = await supabaseBrowserClient
        .from("profiller")
        .select("profil_fotografi")
        .eq("id", user.id)
        .single();
      if (data?.profil_fotografi) {
        // Cache busting için ?t=... ekliyoruz (Tarayıcı önbelleğini atlatmak için)
        setProfilFoto(`${data.profil_fotografi}?t=${Date.now()}`);
      }
    };
    fetchProfilePhoto();

    // REALTIME SUBSCRIPTION (Canlı Takip)
    // "profiller" tablosunda bu kullanıcının satırı değişirse (UPDATE) tetiklenir.
    const channel = supabaseBrowserClient
      .channel("navbar-profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiller",
          filter: `id=eq.${user.id}`, // Sadece benim ID'm değişirse haber ver
        },
        (payload) => {
          // Yeni fotoğrafı state'e at
          setProfilFoto(`${payload.new.profil_fotografi}?t=${Date.now()}`);
        },
      )
      .subscribe();

    // Cleanup: Bileşen ölürken kanalı kapat
    return () => {
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [user]);

  return (
    // useClickOutside hook'u bu div'in dışına tıklanıp tıklanmadığını izler.
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-x-2 outline-none"
      >
        {user?.user_metadata?.display_name ? (
          <>
            <Image
              src={profilFoto || "/default-user.jpg"}
              alt="Profil"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            {/* Mobilde gizle, desktopta göster */}
            <p className="text-primary-200 hidden font-semibold sm:block dark:text-white">
              {user.user_metadata.display_name}
            </p>
          </>
        ) : (
          <FaUserCircle className="fill-primary-750 dark:fill-primary-50 h-8 w-8" />
        )}
      </button>

      {isOpen && (
        <ProfileDropdown
          user={user}
          avatarUrl={profilFoto}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
