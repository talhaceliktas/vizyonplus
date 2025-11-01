"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import vizyonPLusLogo from "../../public/logo.png";
import Image from "next/image";
import AsagiAcilirMenu from "./AsagiAcilirMenu";
import { FaUserCircle } from "react-icons/fa";
import supabaseBrowserClient from "../_lib/supabase/client";
import { User } from "@supabase/supabase-js";
import useDisariTiklamaAlgila from "../hooks/useDisariTiklamaAlgila";
import supabase from "../_lib/supabase/client";
import Arama from "./Arama";
import { ThemeSwitcher } from "../_lib/next-theme/ThemeSwitcher";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (!currentUser) setIsDropdownOpen(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const [profilFoto, setProfilFoto] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfilePhoto = async () => {
      const { data, error } = await supabase
        .from("profiller")
        .select("profil_fotografi")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profil fotoğrafı alınamadı:", error.message);
        return;
      }

      if (data?.profil_fotografi) {
        // Cache kırmak için zaman etiketi ekle
        setProfilFoto(`${data.profil_fotografi}?t=${Date.now()}`);
      }
    };

    fetchProfilePhoto();

    // Realtime güncelleme dinleyicisi (isteğe bağlı)
    const channel = supabase
      .channel("profiller-changes")
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
          setProfilFoto(`${newFoto}?t=${Date.now()}`);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const [isTop, setIsTop] = useState(true);
  // 1. Dropdown menünün durumunu tutmak için state

  // 2. Dışarıya tıklamayı algılamak için ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isOpen: isDropdownOpen, setIsOpen: setIsDropdownOpen } =
    useDisariTiklamaAlgila(dropdownRef);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // isTop bağımlılığını kaldırdım, gereksiz yeniden render'ı önler

  return (
    <div
      className={`fixed top-0 z-10 w-full duration-300 ${
        isTop ? "" : "bg-primary-950/35 backdrop-blur-xl"
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 duration-300 md:justify-around ${
          isTop ? "py-6" : "py-4"
        }`}
      >
        <Link href="/">
          <Image
            alt="Vizyon Plus Logosu"
            src={vizyonPLusLogo}
            className="w-32 sm:w-38"
          />
        </Link>
        <div className="dark:text-primary-50 hidden items-center gap-x-5 font-semibold md:flex">
          <Link
            href="/icerikler"
            className="dark:hover:text-primary-200 dark:text-primary-50 text-primary-200 hover:text-primary-400 duration-300"
          >
            Dijital İçerikler
          </Link>
          <Link
            href="/kampanyalar"
            className="dark:hover:text-primary-200 dark:text-primary-50 text-primary-200 hover:text-primary-400 duration-300"
          >
            Kampanyalar
          </Link>
          <Arama />
        </div>

        {/* Konumlandırma için bir container ve ref ataması */}
        <div className="relative" ref={dropdownRef}>
          {/* İkonu bir butona çeviriyoruz. Tıklanınca state'i değiştirir. */}
          <div className="flex items-center gap-x-10">
            <ThemeSwitcher />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Tıklanınca durumu tersine çevir
              className="cursor-pointer"
            >
              <div
                className={
                  user?.user_metadata?.display_name &&
                  "flex items-center gap-x-2"
                }
              >
                {user?.user_metadata?.display_name ? (
                  <>
                    <Image
                      src={profilFoto || "/default-user.jpg"}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <p>{user?.user_metadata?.display_name}</p>
                  </>
                ) : (
                  <FaUserCircle className="h-8 w-8" />
                )}
              </div>
            </button>
            {/* State true ise menüyü göster */}
            {isDropdownOpen && (
              <AsagiAcilirMenu
                user={user}
                profilFoto={profilFoto}
                setIsDropdownOpen={setIsDropdownOpen}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
