"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import LoadingSpinner from "@shared/components/ui/LoadingSpinner"; // Varsa kullan, yoksa null dön

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Layout kaymasını önlemek için boş bir placeholder
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      type="button"
      className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none dark:hover:bg-white/10"
      aria-label="Temayı değiştir"
    >
      {/* Güneş İkonu (Dark modda gizli, Light modda görünür) */}
      <FaSun
        className={`h-5 w-5 text-yellow-500 transition-all duration-300 ${
          theme === "dark"
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
      />

      {/* Ay İkonu (Light modda gizli, Dark modda görünür) */}
      <FaMoon
        className={`absolute h-5 w-5 text-blue-300 transition-all duration-300 ${
          theme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
};
