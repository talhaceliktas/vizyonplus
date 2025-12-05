"use client";

import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLinks } from "./NavLinks";
import SearchBar from "@features/search/components/SearchBar"; // Path'i ayarla

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Resize olunca menüyü kapat ve scroll kilidini yönet
  useEffect(() => {
    const handleResize = () => window.innerWidth >= 768 && setIsOpen(false);
    window.addEventListener("resize", handleResize);

    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Buton */}
      <button
        className="text-primary-750 dark:text-primary-50 z-50 md:hidden"
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
        className={`bg-primary-900/95 dark:bg-primary-950/95 fixed inset-0 z-40 flex flex-col items-center justify-center gap-y-6 backdrop-blur-lg transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavLinks mobile onClick={() => setIsOpen(false)} />
        <SearchBar />
      </div>
    </>
  );
};
