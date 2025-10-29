"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import biletcimLogo from "../../public/logo.png";
import Image from "next/image";
import AsagiAcilirMenu from "./AsagiAcilirMenu";
import { FaUserCircle } from "react-icons/fa";
import supabaseBrowserClient from "../_lib/supabase/client";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (!user) setIsDropdownOpen(false);
      },
    );

    // cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const [isTop, setIsTop] = useState(true);
  // 1. Dropdown menünün durumunu tutmak için state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 2. Dışarıya tıklamayı algılamak için ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // isTop bağımlılığını kaldırdım, gereksiz yeniden render'ı önler

  // 3. Dışarıya tıklanınca menüyü kapatan useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Eğer tıklanan yer dropdownRef'in (menü ve ikonun) dışındaysa
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false); // Menüyü kapat
      }
    };

    // Event listener'ı ekle
    document.addEventListener("mousedown", handleClickOutside);
    // Component kaldırıldığında listener'ı temizle
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Bu effect sadece bir kez çalışmalı

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
            alt="Biletcim Logosu"
            src={biletcimLogo}
            className="w-32 sm:w-44"
          />
        </Link>
        <div className="hidden items-center gap-x-5 font-semibold md:flex">
          <Link
            href="/icerikler"
            className="hover:text-primary-200 duration-300"
          >
            Dijital İçerikler
          </Link>
          <Link
            href="/kampanyalar"
            className="hover:text-primary-200 duration-300"
          >
            Kampanyalar
          </Link>
          <input
            type="text"
            className="bg-primary-50 placeholder:text-primary-500 text-primary-900 w-[15rem] rounded-full p-1 pl-3 duration-300 focus:w-[20rem]"
            placeholder="Ara..."
          />
        </div>

        {/* Konumlandırma için bir container ve ref ataması */}
        <div className="relative" ref={dropdownRef}>
          {/* İkonu bir butona çeviriyoruz. Tıklanınca state'i değiştirir. */}
          <div className="flex">
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
                      src="https://avatar.iran.liara.run/public"
                      alt=""
                      width={40}
                      height={40}
                    />
                    <p>{user?.user_metadata?.display_name}</p>
                  </>
                ) : (
                  <FaUserCircle className="h-8 w-8" />
                )}
              </div>
            </button>

            {/* State true ise menüyü göster */}
            {isDropdownOpen && <AsagiAcilirMenu user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
