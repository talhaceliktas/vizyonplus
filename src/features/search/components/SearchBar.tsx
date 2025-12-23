"use client";

/**
 * Bu bileşen, kullanıcıların içerik araması yapmasını sağlayan arama çubuğudur.
 * - Yazılan sorguya göre anlık arama yapar (useEffect ve AbortController ile).
 * - Sonuçları `SearchResultsList` bileşeninde gösterir.
 * - Dışarı tıklandığında sonuç penceresini kapatır (useClickOutside).
 */

import { useEffect, useRef, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

// Servisler ve Hooklar
import { searchContent } from "@/features/search/services/SearchService";
import useClickOutside from "@/shared/hooks/useClickOutside";

// Sonuçları listeleyen alt bileşen
import SearchResultsList, { SearchResult } from "./SearchResultsList";

const SearchBar = () => {
  const [query, setQuery] = useState(""); // Arama metni
  const [results, setResults] = useState<SearchResult[]>([]); // Arama sonuçları
  const [isMobileView, setIsMobileView] = useState(false); // Mobil görünüm kontrolü

  const containerRef = useRef(null); // Dışarı tıklamayı algılamak için ref
  const { isOpen, setIsOpen } = useClickOutside(containerRef);

  // --- Mobil Görünüm Kontrolü ---
  // Ekran boyutuna göre isMobileView state'ini günceller
  useEffect(() => {
    const checkIsMobile = () => setIsMobileView(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // --- Arama Mantığı ---
  // Query değiştiğinde çalışır. AbortController ile eski istekleri iptal eder.
  useEffect(() => {
    const controller = new AbortController();

    if (query.length >= 2) {
      const performSearch = async () => {
        try {
          // Servis üzerinden arama yap (sinyal ile iptal edilebilir)
          const data = await searchContent(query, controller.signal);
          setResults(Array.isArray(data) ? data : []);
        } catch (err) {
          // Eğer hata iptal hatası değilse sonuçları temizle
          if ((err as Error).name !== "AbortError") {
            setResults([]);
          }
        }
      };
      performSearch();
    } else {
      // 2 karakterden azsa sonuçları temizle
      setResults([]);
    }

    // Cleanup: Yeni efekt çalışmadan önce veya bileşen sökülürken isteği iptal et
    return () => controller.abort();
  }, [query]);

  // Listeyi kapatma ve arama metnini temizleme fonksiyonu
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
        {/* Büyüteç İkonu (Sadece masaüstünde input içinde göster) */}
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
          onClick={() => setIsOpen(true)} // Tıklayınca listeyi aç
        />
      </div>

      {/* Sonuç Listesi (Eğer sonuç varsa ve pencere açıksa göster) */}
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
