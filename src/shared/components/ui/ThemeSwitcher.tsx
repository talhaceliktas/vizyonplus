"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-5 left-5 z-9999">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border p-2.5 shadow-lg md:h-14 md:w-14 md:p-3 lg:h-16 lg:w-16 lg:p-3.5" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-9999">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        type="button"
        className={`group relative flex h-12 w-12 items-center justify-center rounded-full border p-2.5 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:outline-none md:h-14 md:w-14 md:p-3 lg:h-16 lg:w-16 lg:p-3.5 ${
          theme === "dark"
            ? "bg-primary-50 hover:border-accent-600 border-gray-700"
            : "bg-primary-800 border-primary-800 hover:border-accent-300"
        }`}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <FaSun className="h-6 w-6 text-amber-400 md:h-7 md:w-7 lg:h-8 lg:w-8" />
        ) : (
          <FaMoon className="h-6 w-6 text-slate-100 md:h-7 md:w-7 lg:h-8 lg:w-8" />
        )}

        <div className="from-accent-400 to-accent-600 dark:from-accent-500 dark:to-accent-700 absolute -inset-1 rounded-full bg-linear-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
      </button>
    </div>
  );
};
