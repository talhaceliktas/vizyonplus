"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { FaUserCircle, FaExternalLinkAlt } from "react-icons/fa";

// Import yollarına dikkat
import supabaseClient from "@lib/supabase/client";
import useClickOutside from "@/shared/hooks/useClickOutside";

const AdminNavbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profilFoto, setProfilFoto] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useClickOutside(dropdownRef);

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (!currentUser) setIsOpen(false);
      },
    );
    return () => authListener.subscription.unsubscribe();
  }, [setIsOpen]);

  // 2. Profil Fotoğrafı ve Realtime
  useEffect(() => {
    if (!user) return;

    const fetchProfilePhoto = async () => {
      const { data, error } = await supabaseClient
        .from("profiller")
        .select("profil_fotografi")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profil fotosu hatası:", error.message);
        return;
      }

      if (data?.profil_fotografi) {
        setProfilFoto(`${data.profil_fotografi}?t=${Date.now()}`);
      }
    };

    fetchProfilePhoto();

    const channel = supabaseClient
      .channel("admin-photo-update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiller",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const newFoto = payload.new.profil_fotografi;
          if (newFoto) {
            setProfilFoto(`${newFoto}?t=${Date.now()}`);
          }
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [user]);

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-8 backdrop-blur-sm">
      {/* Sol taraf: Başlık */}
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-white">Yönetim Paneli</h1>
        <p className="text-xs text-neutral-400">
          Vizyon+ İçerik Yönetim Sistemi
        </p>
      </div>

      <div className="flex items-center gap-x-6">
        <Link
          href="/"
          target="_blank"
          className="text-primary-400 hover:text-primary-300 flex items-center gap-x-2 text-sm font-medium transition-colors"
        >
          <span>Siteyi Görüntüle</span>
          <FaExternalLinkAlt className="text-xs" />
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer items-center gap-x-3 rounded-full border border-transparent p-1 transition-all hover:border-neutral-700"
          >
            <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-800">
              {profilFoto ? (
                <Image
                  src={profilFoto}
                  alt="Admin"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUserCircle className="h-full w-full text-neutral-500" />
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-white">
                {user?.user_metadata?.display_name || "Admin"}
              </p>
              <p className="text-xs text-neutral-500">Yönetici</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
