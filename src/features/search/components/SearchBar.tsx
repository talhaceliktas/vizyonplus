"use client";

import { useEffect, useRef, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

// Servisler ve Hooklar
import { searchContent } from "@/features/search/services/SearchService";
import useClickOutside from "@/shared/hooks/useClickOutside";

// Yeni ayırdığımız bileşen
import SearchResultsList, { SearchResult } from "./SearchResultsList";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);

  const containerRef = useRef(null);
  const { isOpen, setIsOpen } = useClickOutside(containerRef);

  // --- Mobil Kontrolü ---
  useEffect(() => {
    const checkIsMobile = () => setIsMobileView(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // --- Arama Mantığı ---
  useEffect(() => {
    const controller = new AbortController();

    if (query.length >= 2) {
      const performSearch = async () => {
        try {
          const data = await searchContent(query, controller.signal);
          setResults(Array.isArray(data) ? data : []);
        } catch (err) {
          if ((err as Error).name !== "AbortError") {
            setResults([]);
          }
        }
      };
      performSearch();
    } else {
      setResults([]);
    }

    return () => controller.abort();
  }, [query]);

  // Listeyi kapatma ve temizleme fonksiyonu
  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div
      className={isMobileView ? "w-full px-4" : "relative"}
      ref={containerRef}
    >
      <div className="relative flex items-center">
        {/* İkon */}
        {!isMobileView && (
          <div className="pointer-events-none absolute left-3 text-gray-500 dark:text-gray-400">
            <HiOutlineMagnifyingGlass className="h-5 w-5" />
          </div>
        )}

        <input
          type="text"
          className={`/* Light Mode Input */ /* Dark Mode Input */ /* Boyutlandırma */ rounded-full border border-transparent bg-gray-100 py-2 text-gray-900 transition-all duration-300 outline-none placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-yellow-500/50 dark:focus:bg-black/60 dark:focus:ring-yellow-500/10 ${
            isMobileView ? "w-full px-4 text-base" : "w-64 pr-4 pl-10 text-sm"
          } `}
          placeholder={isMobileView ? "Ara..." : "İçerik ara..."}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          onClick={() => setIsOpen(true)}
        />
      </div>

      {results.length > 0 && isOpen && (
        <SearchResultsList
          results={results}
          onClose={handleClose}
          isMobileView={isMobileView}
        />
      )}
    </div>
  );
};

export default SearchBar;
