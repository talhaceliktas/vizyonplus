"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { User } from "@supabase/supabase-js";
import supabaseBrowserClient from "@/lib/supabase/client"; // Path'i kontrol et
import ProfileDropdown from "./ProfileDropdown";
import useClickOutside from "@hooks/useClickOutside";

export const UserMenu = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profilFoto, setProfilFoto] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hook'u çağırıyoruz
  const { isOpen, setIsOpen } = useClickOutside(dropdownRef);

  // 1. Auth Dinleme
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsOpen(false);
    });
    return () => subscription.unsubscribe();
  }, [setIsOpen]);

  // 2. Profil Fotoğrafı (Aynı kalıyor...)
  useEffect(() => {
    if (!user) return;
    const fetchProfilePhoto = async () => {
      const { data } = await supabaseBrowserClient
        .from("profiller")
        .select("profil_fotografi")
        .eq("id", user.id)
        .single();
      if (data?.profil_fotografi) {
        setProfilFoto(`${data.profil_fotografi}?t=${Date.now()}`);
      }
    };
    fetchProfilePhoto();
    const channel = supabaseBrowserClient
      .channel("navbar-profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiller",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setProfilFoto(`${payload.new.profil_fotografi}?t=${Date.now()}`);
        },
      )
      .subscribe();
    return () => {
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [user]);

  return (
    // Ref'i buraya veriyoruz. Burası "İçerisi" sayılır.
    // Bunun dışına tıklanırsa kapanacak.
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
          // 🔥 DÜZELTİLEN KISIM BURASI:
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
