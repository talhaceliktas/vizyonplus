"use client";

import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLinks } from "./NavLinks";
import SearchBar from "@features/search/components/SearchBar";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Resize olunca menüyü kapat ve scroll kilidini yönet
  useEffect(() => {
    const handleResize = () => window.innerWidth >= 768 && setIsOpen(false);
    window.addEventListener("resize", handleResize);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Buton */}
      <button
        // Z-Index 51 yapıldı ki menü açılınca overlay'in (z-40) üstünde kalsın
        className={`relative z-50 transition-colors duration-300 md:hidden ${
          isOpen
            ? "text-gray-900 dark:text-white" // Menü açıkken
            : "text-gray-900 dark:text-white" // Menü kapalıyken
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menüyü aç/kapat"
      >
        {isOpen ? (
          <FaTimes className="h-6 w-6" />
        ) : (
          <FaBars className="h-6 w-6" />
        )}
      </button>

      {/* Overlay Menü */}
      <div
        className={`cubic-bezier(0.4, 0, 0.2, 1) fixed inset-0 z-40 flex h-screen flex-col items-center justify-center gap-y-8 bg-white/95 text-gray-900 backdrop-blur-xl transition-transform duration-500 md:hidden dark:bg-black/95 dark:text-white ${isOpen ? "translate-x-0" : "translate-x-full"} `}
      >
        {/* Nav Linkler */}
        <div className="flex flex-col items-center gap-y-6 text-xl font-bold">
          <NavLinks mobile onClick={() => setIsOpen(false)} />
        </div>

        {/* Arama Çubuğu */}
        <div className="w-3/4 max-w-sm">
          <SearchBar />
        </div>
      </div>
    </>
  );
};
