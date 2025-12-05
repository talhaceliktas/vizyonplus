"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Bağımlılıklar (Yeni yerlerinden çağırıyoruz)
import { searchContent } from "@/features/search/services/SearchService";
import useClickOutside from "@/shared/hooks/useClickOutside";

// Tip Tanımı
interface SearchResult {
  id: string | number;
  fotograf: string;
  isim?: string;
  aciklama?: string;
  tur?: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState(""); // 'arama' -> 'query'
  const [results, setResults] = useState<SearchResult[]>([]); // 'veriler' -> 'results'
  const [isMobileView, setIsMobileView] = useState(false);

  const containerRef = useRef(null); // 'aramaRef' -> 'containerRef'

  // Hook ismini İngilizce yaptıysan güncelle
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
          // Servis fonksiyonunu çağır
          const data = await searchContent(query, controller.signal);
          setResults(Array.isArray(data) ? data : []);
        } catch (err) {
          // Hata yönetimi (AbortError hariç)
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

  return (
    <div
      className={isMobileView ? "w-full px-4" : "relative"}
      ref={containerRef}
    >
      <input
        type="text"
        className={
          isMobileView
            ? "dark:bg-primary-50 bg-primary-200 dark:placeholder:text-primary-500 placeholder:text-primary-950 text-primary-900 w-full rounded-md p-2 pl-4 text-lg outline-none"
            : "dark:bg-primary-50 bg-primary-200 dark:placeholder:text-primary-500 placeholder:text-primary-950 text-primary-900 w-60 rounded-full p-1 pl-3 duration-300 outline-none focus:w-[20rem]"
        }
        placeholder="Film veya dizi ara..."
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        onClick={() => setIsOpen(true)}
      />

      {/* Sonuç Listesi */}
      {results.length > 0 && isOpen && (
        <div
          className={
            isMobileView
              ? "mt-4 grid max-h-[50vh] grid-cols-1 gap-2 overflow-y-auto"
              : "bg-primary-900 absolute top-12 z-50 grid w-[200%] -translate-x-1/4 grid-cols-1 gap-2 rounded-lg border border-gray-700 p-2 shadow-xl"
          }
        >
          {results.map((item) => (
            <Link
              key={item.id}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              href={`/icerikler/${item.tur === "film" ? "filmler" : "diziler"}/${item.id}`}
              className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-white/10"
            >
              {/* Görsel */}
              <div className="relative h-16 w-12 shrink-0">
                <Image
                  alt={item.isim || "Görsel"}
                  src={item.fotograf || "/placeholder.jpg"}
                  fill
                  className="rounded object-cover"
                />
              </div>

              {/* Yazılar */}
              <div className="flex min-w-0 flex-1 flex-col">
                <h4 className="truncate text-sm font-semibold text-white">
                  {item.isim}
                </h4>
                <p className="line-clamp-2 text-xs text-gray-400">
                  {item.aciklama}
                </p>
                <span className="text-primary-200 mt-1 text-[10px] tracking-wide uppercase">
                  {item.tur}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
