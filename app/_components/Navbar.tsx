"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import supabase from "../_lib/supabase/client";
import vizyonPLusLogo from "../../public/logo.png";
import Image from "next/image";
import AsagiAcilirMenu from "./AsagiAcilirMenu";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import supabaseBrowserClient from "../_lib/supabase/client";
import { User } from "@supabase/supabase-js";
import useDisariTiklamaAlgila from "../hooks/useDisariTiklamaAlgila";
import Arama from "./Arama";
import { SiteSettings } from "../_lib/supabase/get-settings";
import DuyuruBari from "./DuyuruBari";

const Navbar = ({ settings }: { settings: SiteSettings }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profilFoto, setProfilFoto] = useState<string | null>(null);
  const [isTop, setIsTop] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isOpen: isDropdownOpen, setIsOpen: setIsDropdownOpen } =
    useDisariTiklamaAlgila(dropdownRef);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (!currentUser) setIsDropdownOpen(false);
      },
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

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
        setProfilFoto(`${data.profil_fotografi}?t=${Date.now()}`);
      }
    };
    fetchProfilePhoto();
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

  useEffect(() => {
    const handleScroll = () => setIsTop(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 z-30 w-full duration-300 ${
        isTop ? "" : "dark:bg-primary-950/35 bg-primary-800/25 backdrop-blur-xl"
      }`}
    >
      {settings.duyuru_metni &&
        settings.duyuru_tipi &&
        settings.duyuru_aktif && <DuyuruBari settings={settings} />}
      {/* Üst Bar: Logo, Desktop Linkler, Ikonlar */}
      <div
        className={`relative z-40 flex items-center justify-between px-4 duration-300 md:justify-around ${
          // --- 1. PADDING AZALTILDI ---
          isTop ? "py-4" : "py-3" // <-- py-6 -> py-4 | py-4 -> py-3
        }`}
      >
        <Link href="/" onClick={handleMobileLinkClick}>
          <Image
            alt="Vizyon Plus Logosu"
            src={vizyonPLusLogo}
            className="w-24 sm:w-38"
          />
        </Link>
        {/* Desktop Linkleri */}
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
        {/* Sağ Taraf Ikon Grubu (Profil + Hamburger) */}
        <div className="flex items-center gap-x-4">
          {/* Profil Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-x-10">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer"
              >
                <div
                  className={
                    user?.user_metadata?.display_name
                      ? "flex items-center gap-x-2"
                      : ""
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

                      <p className="text-primary-200 hidden font-semibold sm:block dark:text-white">
                        {user?.user_metadata?.display_name}
                      </p>
                    </>
                  ) : (
                    <FaUserCircle className="dark:fill-primary-50 fill-primary-750 h-8 w-8" />
                  )}
                </div>
              </button>

              {isDropdownOpen && (
                <AsagiAcilirMenu
                  user={user}
                  profilFoto={profilFoto}
                  setIsDropdownOpen={setIsDropdownOpen}
                />
              )}
            </div>
          </div>
          {/* Hamburger Menü Butonu */}
          <button
            className="dark:text-primary-50 text-primary-750 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menüyü aç/kapat"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      <div
        className={`bg-primary-900/95 dark:bg-primary-950/95 text-primary-50 absolute top-0 left-0 z-30 flex h-screen w-full flex-col items-center justify-center text-2xl font-semibold backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${"gap-y-6"}`}
      >
        <Link href="/icerikler" onClick={handleMobileLinkClick}>
          Dijital İçerikler
        </Link>

        <Link href="/kampanyalar" onClick={handleMobileLinkClick}>
          Kampanyalar
        </Link>
        <Arama />
      </div>
    </nav>
  );
};

export default Navbar;
