"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import SearchBar from "@features/search/components/SearchBar";
import AnnouncementBar from "../AnnouncementBar";

import vizyonPLusLogo from "@public/logo.png";
import { Table } from "@/types";

interface NavbarProps {
  settings: Table<"ayarlar">;
}

const Navbar = ({ settings }: NavbarProps) => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // 10px tolerans yeterli, hemen tepki versin
      setIsTop(window.scrollY < 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isTop
          ? "bg-linear-to-b from-white/90 via-white/50 to-transparent py-6 backdrop-blur-[2px] dark:from-black/90 dark:via-black/50 dark:to-transparent dark:backdrop-blur-none"
          : "border-gray-200 bg-white/90 py-3 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-black/90 dark:shadow-black/50"
      }`}
    >
      {/* Duyuru Alanı */}
      <div className="w-full">
        {settings?.duyuru_aktif && settings?.duyuru_metni && (
          <div className="mb-2">
            <AnnouncementBar settings={settings} />
          </div>
        )}
      </div>

      {/* --- ANA KONTEYNER --- */}
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 sm:px-8">
        {/* SOL GRUP */}
        <div className="flex items-center gap-x-8 lg:gap-x-12">
          {/* Logo */}
          <Link
            href="/"
            className="group relative flex shrink-0 items-center transition-transform outline-none hover:scale-105 active:scale-95"
            aria-label="Vizyon Plus Ana Sayfa"
          >
            <Image
              alt="Vizyon Plus Logosu"
              src={vizyonPLusLogo}
              priority
              className={`w-auto object-contain transition-all duration-500 ease-in-out ${
                isTop
                  ? "h-8 translate-y-0.5 sm:h-10" // Üstte
                  : "h-7 sm:h-8" // Aşağıda
              }`}
            />
          </Link>

          {/* Desktop Linkler */}
          <div className="hidden items-center gap-x-6 md:flex lg:gap-x-8">
            <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
          <div
            className={`hidden transition-all duration-500 md:block ${isTop ? "opacity-100" : "opacity-90"}`}
          >
            <SearchBar />
          </div>

          {/* Profil */}
          <div className="shrink-0">
            <UserMenu />
          </div>

          {/* Mobil */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
