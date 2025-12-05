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

const Navbar = ({ settings }: { settings: Table<"ayarlar"> }) => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsTop(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-30 w-full duration-300 ${
        isTop
          ? "bg-transparent"
          : "bg-primary-800/25 dark:bg-primary-950/35 backdrop-blur-xl"
      }`}
    >
      {settings?.duyuru_aktif && settings?.duyuru_metni && (
        <AnnouncementBar settings={settings} />
      )}

      <div
        className={`relative z-40 flex items-center justify-between px-4 duration-300 md:justify-around ${
          isTop ? "py-4" : "py-3"
        }`}
      >
        <Link href="/">
          <Image
            alt="Vizyon Plus Logosu"
            src={vizyonPLusLogo}
            className="w-24 object-contain sm:w-38"
            priority
          />
        </Link>

        <div className="hidden items-center gap-x-5 md:flex">
          <NavLinks />
          <SearchBar />
        </div>

        <div className="flex items-center gap-x-4">
          <UserMenu />
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
